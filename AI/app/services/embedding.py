import cv2
from fastapi import HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.models.entities.id_mapping import IdMapping
from app.utils.convert import convert_uuid_to_int
from app.utils.verifyImage import verify_image
from app.config.faiss import get_faiss_manager
from app.services.ai import extract_face, get_embedding
from app.models.entities.person import Person
from app.models.entities.face_record import FaceRecord
from app.database.db import SessionLocal

def create_face_record_bg(person_id: str, image_path: str = None, image_base64: str = None):
    db = SessionLocal()
    try:
        image = verify_image(image_path=image_path, image_base64=image_base64)
        if image is None:
            print("[Background] Không đọc được ảnh")
            return

        face_tensor = extract_face(image)
        if face_tensor is None:
            print("[Background] Không phát hiện face")
            return

        embedding = get_embedding(face_tensor)

        face_record = FaceRecord(
            person_id=person_id,
            image_path=image_path if image_path else "pending_upload",
            embedding=embedding
        )

        faiss_id = convert_uuid_to_int(person_id)
        id_mapping = IdMapping(faiss_id=faiss_id, person_id=person_id)

        db.add(face_record)
        db.add(id_mapping)
        db.commit()

        faiss_manager = get_faiss_manager()   
        faiss_manager.add_vector(embedding, faiss_id)

    except Exception as e:
        db.rollback()
        print(f"[Background] Lỗi: {str(e)}")
    finally:
        db.close()

def create_person(db: Session, data, background_tasks: BackgroundTasks):
    person = Person(
    name=data.name,
    age=data.age,
    gender=data.gender,
    date_of_birth=data.date_of_birth
    )

    db.add(person)
    db.commit()

    # gọi background task
    background_tasks.add_task(create_face_record_bg, str(person.id), data.image_path, data.image_base64)

    return {
        "id": person.id,
        "name": person.name,
        "message": "Tạo hồ sơ thành công, embedding sẽ xử lý background."
    }
  

# UPDATE
def update_person(db: Session, person_id, data):
    person = db.query(Person).filter(Person.id == person_id).first()
    if not person:
        return None

    if data.name is not None:
        person.name = data.name
    if data.age is not None:
        person.age = data.age
    if data.gender is not None:
        person.gender = data.gender
    if data.date_of_birth is not None:
        person.date_of_birth = data.date_of_birth

    db.commit()
    db.refresh(person)
    return person

# DELETE
def delete_person(db: Session, person_id: str):
    # Find mapping
    mapping = db.query(IdMapping).filter(IdMapping.person_id == person_id).first()
    if not mapping:
        # Check if the person exists in the database anyway
        person = db.query(Person).filter(Person.id == person_id).first()
        if person:
            db.delete(person)
            db.commit()
            return True
        return False

    faiss_id = mapping.faiss_id

    # Delete from database
    db.query(FaceRecord).filter(FaceRecord.person_id == person_id).delete()
    db.query(IdMapping).filter(IdMapping.person_id == person_id).delete()
    person = db.query(Person).filter(Person.id == person_id).first()
    if person:
        db.delete(person)
    db.commit()

    # Delete from FAISS
    try:
        faiss_manager = get_faiss_manager()
        faiss_manager.remove_vector(faiss_id)
    except Exception as e:
        print(f"[Error] Failed to remove vector from FAISS: {str(e)}")

    return True