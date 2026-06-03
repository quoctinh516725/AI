import os
import time
import numpy as np
import faiss

from app.models.entities.id_mapping import IdMapping

class FaissManager:
    def __init__(self, dim=512, index_path="storage/face_index.faiss"):
        self.dim = dim
        self.index_path = index_path
        self.index = None
        self.load_index()

    def load_index(self):
        if os.path.exists(self.index_path) and os.path.getsize(self.index_path) > 0:
            try:
                self.index = faiss.read_index(self.index_path)
            except:
                self.index = faiss.IndexIDMap(faiss.IndexFlatL2(self.dim))
        else:
            self.index = faiss.IndexIDMap(faiss.IndexFlatL2(self.dim))
      
    def save_index(self):           
        faiss.write_index(self.index, self.index_path)

    def add_vector(self, embedding, person_id):
        vec = np.array(embedding, dtype="float32").reshape(1, -1)

        ids = np.array([person_id], dtype="int64")
        self.index.add_with_ids(vec, ids)
        self.save_index()

    def search_vector(self, embedding, db, k=5):
        # Chuẩn bị query
        query = np.array(embedding, dtype="float32").reshape(1, -1)

        # FAISS search
        distances, ids = self.index.search(query, k)

        # Lấy faiss_ids hợp lệ
        faiss_ids = [int(f) for f in ids[0] if f != -1]
    
        if not faiss_ids:
            print("[Time Log] No valid faiss_ids found, returning empty list")
            return []

        # Query DB
        mappings = db.query(IdMapping).filter(IdMapping.faiss_id.in_(faiss_ids)).all()
       
        # Tạo mapping dict
        faiss_person_id_map = {m.faiss_id: m.person_id for m in mappings}
       
        # Build final results
        final_results = []
        for faiss_id, distance in zip(ids[0], distances[0]):
            if faiss_id != -1 and faiss_id in faiss_person_id_map:
                person_id = faiss_person_id_map[faiss_id]
                final_results.append((str(person_id), float(distance)))
        return final_results