from fastapi import FastAPI

from app.routers import embedding
from app.routers import search

app = FastAPI()

app.include_router(embedding.router )
app.include_router(search.router)

@app.get("/")
def root():
    return {"message": "Hello World"}

