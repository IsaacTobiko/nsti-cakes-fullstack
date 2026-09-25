from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class ShowUser(BaseModel):
    id: int
    name: str
    email: str
    is_admin: bool

    class Config:
        from_attributes = True

class Login(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ProductCreate(BaseModel):
    name: str
    price: float
    category: str
    image: str
    description: str
    stock_status: str = "In Stock"

class ShowProduct(BaseModel):
    id: int
    name: str
    price: float
    category: str
    image: str
    description: str
    stock_status: str
    sold: int

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    order_code: str
    cake: str
    amount: float
    status: str = "Pending"

class ShowOrder(BaseModel):
    id: int
    order_code: str
    cake: str
    amount: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class PaymentCreate(BaseModel):
    txn_id: str
    order_id: int
    method: str
    amount: float
    status: str = "Pending"

class ShowPayment(BaseModel):
    id: int
    txn_id: str
    order_id: int
    method: str
    amount: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: str
    email: str

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str

class NotificationPrefsSchema(BaseModel):
    new_orders: bool = True
    payments: bool = True
    low_stock: bool = False
    new_customers: bool = True

    class Config:
        from_attributes = True