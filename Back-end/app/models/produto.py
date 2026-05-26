from sqlalchemy import Column, String, Float, Integer
from app.database import Base

class ProdutoModel(Base):
    __tablename__ = "produtos"

    id = Column(String, primary_key=True)
    nome = Column(String, nullable=False)
    descricao = Column(String)
    preco = Column(Float)
    estoque = Column(Integer)
    categoria = Column(String)