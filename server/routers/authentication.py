from fastapi import APIRouter, Depends, status, HTTPException, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
import schemas, database, models
from sqlalchemy.orm import Session
from hashing import Hash
from JWT_token import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from rate_limit import RateLimiter
import os

router = APIRouter(tags=["Authentication"])


ip_limiter = RateLimiter(max_hits=10, window_seconds=60)
email_limiter = RateLimiter(max_hits=5, window_seconds=900)

@router.post("/login")
def login(http_request: Request, response: Response, request: OAuth2PasswordRequestForm=Depends(), db: Session = Depends(database.get_db)):
    ip = http_request.client.host
    email = request.username.strip().lower()

    ip_limiter.check(ip)
    email_limiter.check(email)
    ip_limiter.hit(ip)

    user = db.query(models.User).filter(models.User.email == request.username).first()
    if not user or not Hash.verify(user.password, request.password):
        email_limiter.hit(email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
        
    email_limiter.reset(email)
    access_token = create_access_token(data={"sub": user.email})
    response.set_cookie(
    key="access_token",
    value=access_token,
    httponly=True,
    secure=os.getenv("COOKIE_SECURE", "false")=="true",
    samesite="lax",
    max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    path="/",
)
    return {"is_admin": user.is_admin}