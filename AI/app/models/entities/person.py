from datetime import datetime, timezone
import uuid
from app.database.db import Base
from sqlalchemy import Column, DateTime,  String, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID


class Person(Base):
    __tablename__ = "persons"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4, unique=True, nullable=False)
    name = Column(String,  nullable=False)
    age = Column(String)
    date_of_birth = Column(String)
    gender = Column(String)
    hometown = Column(String, nullable=True)
    lost_year = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))

    face_records = relationship("FaceRecord", back_populates="person", cascade="all, delete-orphan")

