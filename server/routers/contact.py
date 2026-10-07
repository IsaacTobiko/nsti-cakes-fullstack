from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import Session
from datetime import datetime
from database import Base, get_db

router = APIRouter(prefix="/contact", tags=["contact"])


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

@router.post("/", status_code=201)
def send_contact(msg: ContactMessage, db: Session = Depends(get_db)):
    row = ContactDB(name=msg.name.strip(), email=msg.email, message=msg.message.strip())
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"ok": True, "id": row.id}