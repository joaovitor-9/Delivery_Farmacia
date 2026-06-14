import uuid
from app.schemas.produto import Produto
from pydantic import BaseModel, Field

class ItemPedido(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    produto_id: str
    quantidade: int
    preco_unitario: float
    produto: Optional[Produto] = None 

    class Config:
        from_attributes = True