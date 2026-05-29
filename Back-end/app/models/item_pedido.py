from sqlalchemy import Column, String, Float, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
import uuid

class ItemPedidoModel(Base):
    __tablename__ = "itens_pedido"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    quantidade = Column(Integer, nullable=False)
    preco_unitario = Column(Float, nullable=False)

    
    pedido_id = Column(String, ForeignKey("pedidos.id"))
    produto_id = Column(String, ForeignKey("produtos.id"))

    pedido = relationship("PedidoModel", back_populates="itens")
    produto = relationship("ProdutoModel")