from fastapi import APIRouter
from services.scraper import scrape_url

router = APIRouter()


@router.post("/parse-recipe")
async def parse_recipe(payload: dict):

    source = payload.get("url") or payload.get("text", "")

    if not source:
        return {"error": "No URL or text provided"}
    print("source:", source)
    if source.startswith("http"):
        result = scrape_url(source)
        print("result:", result)

        if result:
            return {"source": "scraper", "data": result}
        else:
            return {
                "source": "scraper",
                "error": "Could not parse this URL — site may not be supported",
            }

    return {"recieveded": source, "message": "text parsing next"}
