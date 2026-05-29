from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
import uuid
from datetime import datetime

class PedidoModel(Base):
    __tablename__ = "pedidos"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    status = Column(String, default="PENDENTE")
    valor_total = Column(Float, nullable=False)
    data_criacao = Column(DateTime, default=datetime.utcnow)

    cliente_id = Column(String, ForeignKey("usuarios.id"))
    endereco_id = Column(String, ForeignKey("enderecos.id")) 

    cliente = relationship("UsuarioModel", back_populates="pedidos")
    endereco_entrega = relationship("EnderecoModel") 
    itens = relationship("ItemPedidoModel", back_populates="pedido")