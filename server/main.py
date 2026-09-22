from fastapi import FastAPI
from database import engine
import models
from routers import user, authentication, products, orders, admin, payments

app = FastAPI()

app.include_router(authentication.router)
app.include_router(user.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(admin.router)
app.include_router(payments.router)