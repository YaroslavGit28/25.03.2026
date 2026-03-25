from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/reviews", tags=["reviews"])

db: list[dict] = [
    {"id": 1, "product_id": 1, "author": "Женя",  "text": "Помоги пж с домашкой!",         "rating": 5, "date": "2026-03-26"},
    {"id": 2, "product_id": 1, "author": "Андрей", "text": "HELP", "rating": 5, "date": "2026-03-26"},
    {"id": 3, "product_id": 2, "author": "Ярослав",  "text": "моя голова кругом!!!", "rating": 5, "date": "2026-03-26"},
    {"id": 4, "product_id": 3, "author": "Максим",  "text": "ПУ ПУ ПУ", "rating": 1, "date": "2026-03-26"},
]
next_id = 5

class ReviewIn(BaseModel):
    product_id: int
    author: str
    text: str
    rating: int     # от 1 до 5

@router.get("/")
def get_reviews(product_id: int | None = Query(default=None)):
    # Если передан product_id — вернем только отзывы этого товара.
    if product_id is not None:
        return [r for r in db if r["product_id"] == product_id]
    return db

@router.post("/", status_code=201)
def add_review(body: ReviewIn):
    global next_id
    # 1) Проверки
    author = body.author.strip()
    text = body.text.strip()

    if not author:
        raise HTTPException(400, "Имя не должно быть пустым")
    if not text:
        raise HTTPException(400, "Текст отзыва не должен быть пустым")
    if body.rating < 1 or body.rating > 5:
        raise HTTPException(400, "Рейтинг от 1 до 5")

    from routers.products import db as products_db

    product_exists = any(p["id"] == body.product_id for p in products_db)
    if not product_exists:
        raise HTTPException(400, "Товар не найден")

    # 2) Создание
    review = {
        "id": next_id,
        "product_id": body.product_id,
        "author": author,
        "text": text,
        "rating": body.rating,
        "date": datetime.now().strftime("%Y-%m-%d"),
    }
    db.append(review)
    next_id += 1
    return review


@router.get("/stats")
def get_stats(product_id: int):
    reviews = [r for r in db if r["product_id"] == product_id]
    total = len(reviews)

    avg = round((sum(r["rating"] for r in reviews) / total), 1) if total else 0

    stars: dict[str, int] = {}
    for i in range(1, 6):
        stars[str(i)] = sum(1 for r in reviews if r["rating"] == i)

    return {
        "product_id": product_id,
        "total_reviews": total,
        "average_rating": avg,
        "stars": stars,
    }
