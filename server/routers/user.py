from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
import schemas, database, models, oauth2
from hashing import Hash

router = APIRouter(prefix="/user", tags=["Users"])

@router.post("/", response_model=schemas.ShowUser, status_code=status.HTTP_201_CREATED)
def create_user(request: schemas.UserCreate, db: Session = Depends(database.get_db)):
    existing = db.query(models.User).filter(models.User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    new_user = models.User(
        name=request.name,
        email=request.email,
        password=Hash.bcrypt(request.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/", response_model=list[schemas.ShowUser])
def get_all(
    db: Session = Depends(database.get_db),
    admin: models.User = Depends(oauth2.get_admin_user),
):
    return db.query(models.User).all()



@router.put("/me", response_model=schemas.ShowUser)
def update_profile(
    request: schemas.UserUpdate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    user.name = request.name
    user.email = request.email
    db.commit()
    db.refresh(user)
    return user

@router.put("/me/password")
def update_password(
    request: schemas.PasswordUpdate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    if not Hash.verify(user.password, request.current_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")
    user.password = Hash.bcrypt(request.new_password)
    db.commit()
    return {"message": "Password updated successfully"}

@router.get("/me/notifications", response_model=schemas.NotificationPrefsSchema)
def get_notification_prefs(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    prefs = db.query(models.NotificationPrefs).filter(models.NotificationPrefs.user_id == current_user.id).first()
    if not prefs:
        prefs = models.NotificationPrefs(user_id=current_user.id)
        db.add(prefs)
        db.commit()
        db.refresh(prefs)
    return prefs

@router.put("/me/notifications", response_model=schemas.NotificationPrefsSchema)
def update_notification_prefs(
    request: schemas.NotificationPrefsSchema,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    prefs = db.query(models.NotificationPrefs).filter(models.NotificationPrefs.user_id == current_user.id).first()
    if not prefs:
        prefs = models.NotificationPrefs(user_id=current_user.id)
        db.add(prefs)

    prefs.new_orders = request.new_orders
    prefs.payments = request.payments
    prefs.low_stock = request.low_stock
    prefs.new_customers = request.new_customers
    db.commit()
    db.refresh(prefs)
    return prefs

@router.get("/{id}", response_model=schemas.ShowUser)
def get_user(
    id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    if not current_user.is_admin and current_user.id != id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed",
        )
    user = db.query(models.User).filter(models.User.id == id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {id} not found",
        )
    return user