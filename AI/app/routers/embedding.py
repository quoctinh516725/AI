from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.schemas.person import PersonCreate, PersonUpdate
from app.services import embedding
from fastapi import BackgroundTasks
router = APIRouter(prefix="/embedding")

# Create Person and FaceRecord
@router.post("/")
def create_person(data: PersonCreate,background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    result = embedding.create_person(db, data, background_tasks)
    if result is None:
        raise HTTPException(status_code=400, detail="Không phát hiện khuôn mặt trong ảnh. Vui lòng thử lại với ảnh khác!")
    return result

@router.patch("/{person_id}")
def update_person(person_id: str, data: PersonUpdate, db: Session = Depends(get_db)):
    person = embedding.update_person(db, person_id, data)
    if not person:
        raise HTTPException(status_code=404, detail="Hồ sơ không tồn tại!")
    return person