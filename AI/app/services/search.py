import cv2
from app.config.faiss import get_faiss_manager
from app.services.ai import extract_face, get_embedding
from app.utils.verifyImage import verify_image
    
# Search
import time


def search_embedding(data, db):
    image = verify_image(image_path=data.image_path, image_base64=data.image_base64)

    if image is None:
        raise ValueError("Không đọc được ảnh từ đường dẫn yêu cầu.")
    
    face_tensor = extract_face(image)
    print("Tensor khuôn mặt đã được trích xuất: ", face_tensor)

    embedding = get_embedding(face_tensor)
    print("Embedding đã được trích xuất: ", embedding)

    faiss_manager = get_faiss_manager()

    results = faiss_manager.search_vector(embedding, db, 5)
    
    return results
