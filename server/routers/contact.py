from fastapi import APIRouter
from pydantic import BaseModel, EmailStr, Field

router = APIRouter(prefix="/contact", tags=["contact"])

class ContactMessage(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    message: str = Field(min_length=1, max_length=2000)

@router.post("/")
def send_contact(msg: ContactMessage):
    print(f"Contact from {msg.name} <{msg.email}>: {msg.message}")
    return {"ok": True}