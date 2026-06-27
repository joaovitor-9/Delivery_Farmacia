from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from app.database import Base
import uuid

class UsuarioModel(Base):
    __tablename__ = "usuarios"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    senha_hash = Column(String, nullable=False) 
    cpf = Column(String, unique=True, index=True, nullable=False)
    telefone = Column(String)
    tipo_usuario = Column(String, default="cliente")
    enderecos = relationship("EnderecoModel", back_populates="dono")
    pedidos = relationship("PedidoModel", back_populates="cliente")

