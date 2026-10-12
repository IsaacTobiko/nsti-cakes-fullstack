from fastapi import APIRouter, Depends, Request, HTTPException, Query
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import Session
from datetime import datetime
from database import Base, get_db
from rate_limit import RateLimiter
from typing import List
import oauth2
import models

router = APIRouter(prefix="/contact", tags=["contact"])

contact_minute = RateLimiter(max_hits=2, window_seconds=60)
contact_hour = RateLimiter(max_hits=5, window_seconds=3600) 

class ContactDB(Base):
    __tablename__="contact_messages"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    message = Column(String(2000), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class ContactMessage(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    message: str = Field(min_length=1, max_length=2000)

class ShowContact(BaseModel):
    id: int
    name: str
    email: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True

@router.post("/", status_code=201)
def send_contact(request: Request, msg: ContactMessage, db: Session = Depends(get_db)):
    ip = request.client.host
    contact_minute.check(ip)
    contact_hour.check(ip)
    contact_minute.hit(ip)
    contact_hour.hit(ip)
    row = ContactDB(name=msg.name.strip(), email=msg.email, message=msg.message.strip())
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"ok": True, "id": row.id}

@router.get("/", response_model=List[ShowContact])
def get_messages(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    admin: models.User = Depends(oauth2.get_admin_user),
):
    return(
        db.query(ContactDB)
        .order_by(ContactDB.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

@router.delete("/{id}", status_code=204)
def delete_message(
    id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(oauth2.get_admin_user),
):
    row=db.query(ContactDB).filter(ContactDB.id == id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(row)
    db.commit()