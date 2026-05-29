from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
import uuid

class EnderecoModel(Base):
    __tablename__ = "enderecos"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    rua = Column(String, nullable=False)
    numero = Column(String, nullable=False)
    bairro = Column(String, nullable=False)
    cidade = Column(String, nullable=False)
    cep = Column(String, nullable=False)
    
    usuario_id = Column(String, ForeignKey("usuarios.id"))
    
    dono = relationship("UsuarioModel", back_populates="enderecos")