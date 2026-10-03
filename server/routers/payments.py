from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
import schemas, database, models, oauth2

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.get("/", response_model=list[schemas.ShowPayment])
def get_all(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(oauth2.get_admin_user),
):
    return db.query(models.Payment).all()

@router.post("/", response_model=schemas.ShowPayment, status_code=status.HTTP_201_CREATED)
def create(
    request: schemas.PaymentCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    order = db.query(models.Order).filter(models.Order.id == request.order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with id {request.order_id} not found",
        )

    new_payment = models.Payment(**request.dict())
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    return new_payment

@router.get("/{id}", response_model=schemas.ShowPayment)
def get_one(
    id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    payment = db.query(models.Payment).filter(models.Payment.id == id).first()
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Payment with id {id} not found",
        )
    return payment