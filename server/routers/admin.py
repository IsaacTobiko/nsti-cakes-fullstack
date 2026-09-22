from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
import database, models, oauth2

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/stats")
def get_stats(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    total_orders = db.query(models.Order).count()
    total_revenue = db.query(func.sum(models.Order.amount)).scalar() or 0
    pending_orders = db.query(models.Order).filter(models.Order.status == "Pending").count()
    total_customers = db.query(models.User).count()

    top_cakes = (
        db.query(models.Order.cake, func.count(models.Order.id).label("orders"))
        .group_by(models.Order.cake)
        .order_by(func.count(models.Order.id).desc())
        .limit(5)
        .all()
    )

    return {
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "pending_orders": pending_orders,
        "total_customers": total_customers,
        "top_selling_cakes": [{"name": name, "orders": count} for name, count in top_cakes],
    }