from pydantic import BaseModel
from typing import Optional

class ProdutoBase(BaseModel):
    nome: str
    descricao: Optional[str] = None
    preco: float
    estoque: int
    categoria: Optional[str] = None

class Produto(ProdutoBase):
    id: str

    class Config:
        from_attributes = True
