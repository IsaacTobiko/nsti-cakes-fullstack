from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import database, models, oauth2, schemas, mpesa

router = APIRouter(prefix="/mpesa", tags=["M-Pesa"])

DELIVERY_FEE = 300


def normalize_phone(p: str) -> str:
    p = p.strip().replace("+", "")
    if p.startswith("0"):
        p = "254" + p[1:]
    if not (p.isdigit() and p.startswith("254") and len(p) == 12):
        raise HTTPException(status_code=400, detail="Invalid phone number")
    return p


@router.post("/pay")
def initiate_payment(
    order_code: str,
    phone_number: str,
    amount: float,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    order = db.query(models.Order).filter(models.Order.order_code == order_code).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    phone_number = phone_number.strip()
    if phone_number.startswith("0"):
        phone_number = "254" + phone_number[1:]
    elif phone_number.startswith("+"):
        phone_number = phone_number[1:]

    result = mpesa.stk_push(phone_number, amount, order_code)

    if result.get("ResponseCode") == "0":
        txn = models.MpesaTransaction(
            checkout_request_id=result["CheckoutRequestID"],
            merchant_request_id=result["MerchantRequestID"],
            order_id=order.id,
            phone_number=phone_number,
            amount=amount,
            status="Pending",
        )
        db.add(txn)
        db.commit()
        return {"message": "STK push sent. Check your phone.", "details": result}
    raise HTTPException(status_code=400, detail=result)


@router.post("/checkout")
def checkout(
    data: schemas.MpesaCheckout,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    codes = set(data.order_codes)
    orders = db.query(models.Order).filter(
        models.Order.order_code.in_(codes),
        models.Order.user_id == current_user.id,
    ).all()
    if len(orders) != len(codes):
        raise HTTPException(status_code=404, detail="Order not found")
    if any(o.status != "Pending" for o in orders):
        raise HTTPException(status_code=400, detail="Order already paid")

    total = sum(o.amount for o in orders)
    if data.delivery_method == "home":
        total += DELIVERY_FEE

    phone = normalize_phone(data.phone_number)
    res = mpesa.stk_push(phone, total, orders[0].order_code[-12:])  
    if res.get("ResponseCode") != "0":
        raise HTTPException(
            status_code=502,
            detail=res.get("errorMessage") or res.get("ResponseDescription") or "STK push failed",
        )

    tx = models.MpesaTransaction(
        checkout_request_id=res["CheckoutRequestID"],
        merchant_request_id=res["MerchantRequestID"],
        order_id=orders[0].id,
        phone_number=phone,
        amount=total,
        status="Pending",
    )
    db.add(tx)
    db.flush()
    for o in orders:
        db.add(models.MpesaTransactionOrder(mpesa_transaction_id=tx.id, order_id=o.id))
    db.commit()
    return {"checkout_request_id": tx.checkout_request_id}


@router.get("/status/{checkout_id}")
def payment_status(
    checkout_id: str,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    tx = db.query(models.MpesaTransaction).filter(
        models.MpesaTransaction.checkout_request_id == checkout_id
    ).first()
    if not tx or tx.order.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Not found")
    return {"status": tx.status, "message": tx.result_desc or ""}


@router.post("/callback")
async def mpesa_callback(request: dict, db: Session = Depends(database.get_db)):
    try:
        stk_callback = request["Body"]["stkCallback"]
        result_code = stk_callback["ResultCode"]
        checkout_request_id = stk_callback["CheckoutRequestID"]

        txn = db.query(models.MpesaTransaction).filter(
            models.MpesaTransaction.checkout_request_id == checkout_request_id
        ).first()

        if not txn:
            return {"ResultCode": 1, "ResultDesc": "Transaction not found"}

        if txn.status != "Pending":  
            return {"ResultCode": 0, "ResultDesc": "Accepted"}

        if result_code == 0:
            items = stk_callback["CallbackMetadata"]["Item"]
            receipt = next(i["Value"] for i in items if i["Name"] == "MpesaReceiptNumber")

            txn.status = "Completed"
            txn.mpesa_receipt = receipt
            txn.result_desc = "Success"

            db.add(models.Payment(
                txn_id=receipt,
                order_id=txn.order_id,
                method="M-Pesa",
                amount=txn.amount,
                status="Completed",
            ))

            links = db.query(models.MpesaTransactionOrder).filter(
                models.MpesaTransactionOrder.mpesa_transaction_id == txn.id
            ).all()
            order_ids = [l.order_id for l in links] or [txn.order_id] 
            for o in db.query(models.Order).filter(models.Order.id.in_(order_ids)).all():
                o.status = "Paid"
        else:
            txn.status = "Failed"
            txn.result_desc = stk_callback.get("ResultDesc", "Failed")

        db.commit()
        return {"ResultCode": 0, "ResultDesc": "Accepted"}
    except Exception as e:
        db.rollback()
        return {"ResultCode": 1, "ResultDesc": str(e)}