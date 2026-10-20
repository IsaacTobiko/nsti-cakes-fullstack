from fastapi import APIRouter, Depends, status, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import html
import schemas, database, models, oauth2
from mail import send_email

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("/mine", response_model=list[schemas.ShowOrder])
def get_my_orders(
    db: Session = Depends(database.get_db),
    current_user: schemas.ShowUser = Depends(oauth2.get_current_user),
):
    return db.query(models.Order).filter(models.Order.user_id == current_user.id).all() 

@router.post("/", response_model=schemas.ShowOrder, status_code=status.HTTP_201_CREATED)
def create(
    request: schemas.OrderCreate,
    db: Session = Depends(database.get_db),
    current_user: schemas.ShowUser = Depends(oauth2.get_current_user),
):
    new_order = models.Order(**request.dict(), user_id=current_user.id)
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order

@router.post("/receipt")
def send_receipt(
    request: schemas.ReceiptRequest,
    background: BackgroundTasks,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    orders = (
        db.query(models.Order)
        .filter(
            models.Order.order_code.in_(request.order_codes),
            models.Order.user_id == current_user.id,
        )
        .all()
    )
    if not orders:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No matching orders")
    
    subtotal = sum(o.amount for o in orders)
    delivery_fee = 300 if request.delivery_method == "home" else 0
    grand_total = subtotal + delivery_fee

    if request.delivery_method == "home":
        where = f"Home delivery to {request.area}, {request.town}"
    else:
        where = "Pickup at Kaslee Centre, 2nd Floor, Room 203, Kitengela"

    name = html.escape(current_user.name or "Customer")
    where_safe = html.escape(where)

    text_lines = [f"Hi {current_user.name or 'Customer'}, thank you for your order!", ""]
    html_rows = ""
    for o in orders:
        text_lines.append(f"- {o.cake}: KSH {o.amount:,.0f} ({o.order_code})")
        html_rows += (
            f"<tr><td style='padding:6px 0'>{html.escape(o.cake)}</td>"
            f"<td style='padding:6px 0;text-align:right'>KSH {o.amount:,.0f}</td></tr>"
        )
    text_lines += [
        "",
        f"Subtotal: KSH {subtotal:,.0f}",
        f"Delivery fee: KSH {delivery_fee:,.0f}",
        f"Grand total: KSH {grand_total:,.0f}",
        "",
        where,
        "",
        "We will contact you soon. - NSTI Cakes",
    ]
    text_body = "\n".join(text_lines)

    html_body = f"""
        <div style='font-family:Arial,sans-serif;max-width:520px;margin:auto;border:1px solid #eee'>
      <div style='background:#2d0d18;color:#fff;padding:16px;font-size:20px'>NSTI Cakes</div>
      <div style='padding:20px;color:#333'>
        <p>Hi {name}, thank you for your order!</p>
        <table style='width:100%;border-collapse:collapse'>{html_rows}</table>
        <hr style='border:none;border-top:1px solid #eee'>
        <p>Subtotal: KSH {subtotal:,.0f}<br>Delivery fee: KSH {delivery_fee:,.0f}</p>
        <p style='font-size:18px;color:#b9861e'><b>Grand total: KSH {grand_total:,.0f}</b></p>
        <p>{where_safe}</p>
        <p style='color:#888;font-size:12px'>We will contact you soon.</p>
      </div>
    </div>
    """ 

    background.add_task(
        send_email, current_user.email, "Your NSTI Cakes order", text_body, html_body
    )
    return {"message": "Receipt email queued"}

@router.get("/{id}", response_model=schemas.ShowOrder)
def get_one(
    id: int,
    db: Session = Depends(database.get_db),
    current_user: schemas.ShowUser = Depends(oauth2.get_current_user),
):
    order = db.query(models.Order).filter(models.Order.id == id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with id {id} no found",
        )
    if not current_user.is_admin and order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed",
        )
    return order

@router.put("/{id}", response_model=schemas.ShowOrder)
def update_status(
    id: int,
    status_value: str,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(oauth2.get_admin_user),
):
    order = db.query(models.Order).filter(models.Order.id == id)
    if not order.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with id {id} not found",
        )
    order.update({"status": status_value})
    db.commit()
    return order.first()

@router.get("/", response_model=list[schemas.ShowOrder])
def get_all(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(oauth2.get_admin_user),
):
    return db.query(models.Order).order_by(models.Order.id.desc()).all()