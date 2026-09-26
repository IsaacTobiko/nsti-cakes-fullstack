from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import database, models, oauth2, mpesa

router = APIRouter(prefix="/mpesa", tags=["M-Pesa"])

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

    if "ResponseCode" in result and result["ResponseCode"] == "0":
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
    else:
        raise HTTPException(status_code=400, detail=result)

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

            order = db.query(models.Order).filter(models.Order.id == txn.order_id).first()
            if order:
                order.status = "Paid"
        else:
                txn.status = "Failed"
                txn.result_desc = stk_callback.get("ResultDesc", "Failed")

        db.commit()
        return {"ResultCode": 0, "ResultDesc": "Accepted"}
    except Exception as e:
        return {"ResultCode": 1, "ResultDesc": str(e)}