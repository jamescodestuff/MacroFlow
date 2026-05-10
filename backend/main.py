from fastapi import FastAPI
from routers import recipe

app = FastAPI()
app.include_router(recipe.router)


@app.get("/")
def root():
    return {"status": "MacroFlow API is running"}
