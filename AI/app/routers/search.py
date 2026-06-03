
from fastapi import APIRouter, Depends, HTTPException
from requests import Session
from app.database.db import get_db
from app.models.schemas.search import SearchRequest, SearchResponse
from app.services.search import search_embedding

router = APIRouter(prefix="/search")

@router.post("/", response_model=SearchResponse)
def search_face(data: SearchRequest, db: Session = Depends(get_db)):
    try:
        search_results = search_embedding(data, db)

    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    if not search_results:
        return SearchResponse(data=[], message="Không tìm thấy khuôn mặt giống trong index!")

    return SearchResponse(data=search_results, message="Tìm kiếm thành công!")