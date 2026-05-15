from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import recipe
from database import engine, Base
import models.recipe

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recipe.router)

@app.get("/")
def root():
    return {"status": "MacroFlow API is running"}
