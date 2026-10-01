from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
import schemas, database, models, oauth2

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/", response_model=list[schemas.ShowProduct])
def get_all(db: Session = Depends(database.get_db)):
    return db.query(models.Product).all()

@router.get("/{id}", response_model=schemas.ShowProduct)
def get_one(id: int, db: Session = Depends(database.get_db)):
    product = db.query(models.Product).filter(models.Product.id == id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {id} not found",
        )
    return product

@router.post("/", response_model=schemas.ShowProduct, status_code=status.HTTP_201_CREATED)
def create(
    request: schemas.ProductCreate, 
    db: Session = Depends(database.get_db),
    admin: models.User = Depends(oauth2.get_admin_user),
):
    new_product = models.Product(**request.dict())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.put("/{id}", response_model=schemas.ShowProduct)
def update(id: int, request: schemas.ProductCreate, db: Session = Depends(database.get_db)):
    product = db.query(models.Product).filter(models.Product.id == id)
    if not product.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {id} not found",
        )
    product.update(request.dict())
    db.commit()
    return product.first()

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def destroy(id: int, db: Session = Depends(database.get_db)):
    product = db.query(models.Product).filter(models.Product.id == id)
    if not product.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {id} not found",
        )
    product.delete(synchronize_session=False)
    db.commit()
