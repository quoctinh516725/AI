from app.services.faiss import FaissManager
faiss_manager = FaissManager()

def get_faiss_manager():
    return faiss_manager