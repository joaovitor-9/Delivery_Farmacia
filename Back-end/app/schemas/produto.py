# app/models/produto.py
from sqlalchemy import Column, String, Float, Integer
from app.database import Base
import uuid

class ProdutoModel(Base):
    __tablename__ = "produtos"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    nome = Column(String, nullable=False)
    descricao = Column(String)
    preco = Column(Float, nullable=False)
    estoque = Column(Integer, default=0)
    categoria = Column(String, nullable=False)