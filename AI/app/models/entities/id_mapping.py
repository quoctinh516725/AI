from sqlalchemy import BigInteger, Column, Integer, String
from app.database.db import Base

class IdMapping(Base):
    __tablename__ = "id_mapping"

    id = Column(Integer, primary_key=True, index=True)
    person_id = Column(String, unique=True, nullable=False)
    faiss_id = Column(BigInteger, unique=True, index=True, nullable=False)
    