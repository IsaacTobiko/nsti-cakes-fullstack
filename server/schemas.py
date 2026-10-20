from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

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

class ShowCustomer(BaseModel):
    name: str
    email: str

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    order_code: str
    cake: str
    amount: float
    status: str = "Pending"
    phone: Optional[str] = None

class ShowOrder(BaseModel):
    id: int
    order_code: str
    cake: str
    amount: float
    status: str
    created_at: datetime
    phone: Optional[str] = None
    customer: Optional[ShowCustomer] = None

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

class GoogleLogin(BaseModel):  
    credential: str  

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=6)

class ReceiptRequest(BaseModel):
    order_codes: List[str] = Field(min_length=1, max_length=50)
    delivery_method: str
    area: str = ""
    town: str = ""

class MpesaCheckout(BaseModel):
    order_codes: List[str] = Field(min_length=1, max_length=50)
    delivery_method: str
    phone_number: str