from sqlalchemy import Column, String
from app.database import Base
import uuid

class FuncionarioModel(Base):
    __tablename__ = "funcionarios"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    nome = Column(String, nullable=False)
    cargo = Column(String, nullable=False) 
    email = Column(String, unique=True, index=True, nullable=False)
    senha_hash = Column(String, nullable=False)