import os
import smtplib
from email.message import EmailMessage
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks, status
from sqlalchemy.orm import Session
from jose import jwt, JWTError
import schemas, database, models
from hashing import Hash
from JWT_token import SECRET_KEY, ALGORITHM
from rate_limit import RateLimiter

router = APIRouter(tags=["Password Reset"])

ip_limiter = RateLimiter(max_hits=5, window_seconds=900)
email_limiter = RateLimiter(max_hits=3, window_seconds=900)
RESET_MINUTES=15

def make_reset_token(user: models.User) ->str:
    payload = {
        "email": user.email,
        "purpose": "reset",
        "fp": user.password[-10],
        "exp": datetime.utcnow() + timedelta(minutes=RESET_MINUTES),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def send_reset_email(to_email: str, link: str):
    host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    port = int(os.getenv("SMTP_PORT", "587"))
    user = os.getenv("SMTP_USER")
    password = os.getenv("SMTP_PASSWORD")

    if not user or not password:
        print(f"[DEV] Password reset link for {to_email}: {link}")
        return

    msg=EmailMessage()
    msg["Subject"]="Reset your NSTI Cakes password"
    msg["From"]=user
    msg["To"]=to_email
    msg.set_content(
        f"Click the link below to reset your password. It expires in {RESET_MINUTES} minutes.\n\n"
        f"{link}\n\nIf you did not request this, ignore this email."
    )
    try:
        with smtplib.SMTP(host, port) as server:
            server.starttls()
            server.login(user, password)
            server.send_message(msg)
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")

@router.post("/forgot-password")
def forgot_password(
    http_request: Request,
    request: schemas.ForgotPasswordRequest,
    background: BackgroundTasks,
    db: Session = Depends(database.get_db),
):
    ip = http_request.client.host
    email = request.email.strip().lower()

    ip_limiter.check(ip)
    email_limiter.check(email)
    ip_limiter.hit(ip)
    email_limiter.hit(email)

    user = db.query(models.User).filter(models.User.email == email).first()
    if user:
        token = make_reset_token(user)
        frontend = os.getenv("FRONTEND_URL", "http://localhost:5173")
        link = f"{frontend}/reset-password?token={token}"
        background.add_task(send_reset_email, user.email, link)

    return {"message": "If that email exists, a reset link has been sent."}

@router.post("/reset-password")
def reset_password(
    request: schemas.ResetPasswordRequest,
    db: Session = Depends(database.get_db),
):
    bad = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Reset link is invalid or has expired",
    )
    try:
        payload = jwt.decode(request.token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise bad

    if payload.get("purpose") != "reset":
        raise bad

    user = db.query(models.User).filter(models.User.email == payload.get("email")).first()
    if not user or user.password[-10] != payload.get("fp"):
        raise bad

    user.password = Hash.bcrypt(request.new_password)
    db.commit()
    return {"message": "Password updated successfully"}