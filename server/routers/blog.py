from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
import schemas, database, models, oauth2
from repository import blog as blog_repository

router = APIRouter(prefix="/blog", tags=["Blogs"])


@router.get("/", response_model=list[schemas.ShowBlog])
def all(
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    return blog_repository.get_all(db)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def destroy(id, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    blog = db.query(models.Blog).filter(models.Blog.id == id)

    if not blog.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Blog with id {id} not found"
        )
    blog.delete(synchronize_session=False)
    db.commit()


@router.put("/{id}", status_code=status.HTTP_202_ACCEPTED)
def update(id, request: schemas.Blog, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    blog = db.query(models.Blog).filter(models.Blog.id == id)

    if not blog.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Blog with id {id} not found"
        )
    blog.update({"title": request.title, "body": request.body})
    db.commit()
    return "updated"


@router.get("/{id}", status_code=200, response_model=schemas.ShowBlog)
def show(id, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    blog = db.query(models.Blog).filter(models.Blog.id == id).first()
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Blog with the id {id} is not available",
        )
    return blog


@router.post("/", status_code=status.HTTP_201_CREATED)
def create(request: schemas.Blog, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    new_blog = models.Blog(title=request.title, body=request.body, user_id=1)
    db.add(new_blog)
    db.commit()
    db.refresh(new_blog)
    return new_blog
