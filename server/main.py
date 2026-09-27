from fastapi import FastAPI
from database import engine
import models
from routers import user, authentication, products, orders, admin, payments, mpesa
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://nsti-cakes-fullstack.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(authentication.router)
app.include_router(user.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(admin.router)
app.include_router(payments.router)
app.include_router(mpesa.router)
app.mount("/static", StaticFiles(directory="static"), name="static")

