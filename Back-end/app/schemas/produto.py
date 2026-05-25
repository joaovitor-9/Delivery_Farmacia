import uuid
from pydantic import BaseModel, Field

class Produto(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nome: str
    descricao: str
    preco: float
    estoque: int
    categoria: str