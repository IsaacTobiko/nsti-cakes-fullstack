from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import schemas, database, models

router = APIRouter()

@router.get('/blog', response_model=list[schemas.ShowBlog], tags=['Blogs'])
def all(db: Session = Depends(database.get_db)):
    blogs = db.query(models.Blog).all()
    return blogs

