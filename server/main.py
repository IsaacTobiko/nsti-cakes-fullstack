from fastapi import FastAPI
from database import engine
import models
from routers import user, authentication, products

app = FastAPI()

models.Base.metadata.create_all(engine)

app.include_router(authentication.router)
app.include_router(user.router)
app.include_router(products.router)
