from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from services.scraper import scrape_url
from services.text_parser import parse_text
from database import get_db
from models.recipe import Recipe

router = APIRouter()


@router.post("/parse-recipe")
async def parse_recipe(payload: dict):
    source = payload.get("url") or payload.get("text", "")

    if not source:
        return {"error": "No URL or text provided"}

    # auto parse with scrape_me api
    if source.startswith("http"):
        result = scrape_url(source)
        if result:
            return {"source": "scraper", "data": result}
        else:
            return {
                "source": "scraper",
                "error": "Could not parse this URL — site may not be supported",
            }

    # raw text parsing
    result = parse_text(source)
    if result.get("low_confidence"):
        return {
            "source": "nlp",
            "low_confidence": True,
            "score": result["score"],
            "data": result[
                "data"
            ],  # still return the data, user might need to manual check/approve later
            "message": f"Low confidence ({result['score']}) — review before saving",
        }
    return result


@router.post("/save-recipe")
def save_recipe(payload: dict, db: Session = Depends(get_db)):
    data = payload.get("data", {})

    recipe = Recipe(
        title=data.get("title"),
        ingredients=data.get("ingredients", []),
        steps=data.get("steps", []),
        image_url=data.get("image"),
        servings=str(data.get("servings", "")),
        source_url=data.get("source_url", ""),
    )

    db.add(recipe)
    db.commit()
    db.refresh(recipe)

    return {"status": "saved", "id": recipe.id, "title": recipe.title}


@router.get("/recipes")
def get_recipes(
    db: Session = Depends(get_db),
    q: str = Query(default="", description="Search query"),
):

    query = db.query(Recipe).order_by(Recipe.created_at.desc())
    if q:
        query = query.filter(Recipe.title.ilike(f"%{q}%"))  # case-insensitive
    recipes = query.all()
    return [
        {
            "id": r.id,
            "title": r.title,
            "ingredients": r.ingredients,
            "steps": r.steps,
            "image_url": r.image_url,
            "servings": r.servings,
            "source_url": r.source_url,
            "created_at": str(r.created_at),
        }
        for r in recipes
    ]


@router.delete("/recipes/{recipe_id}")
def delete_recipes(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    db.delete(recipe)
    db.commit()
    return {"ok": True}
