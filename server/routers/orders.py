from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
import schemas, database, models, oauth2

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("/", response_model=list[schemas.ShowOrder])
def get_all(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(oauth2.get_admin_user),
):
    return db.query(models.Order).all()

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