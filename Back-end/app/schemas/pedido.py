import uuid
from datetime import datetime
from typing import List
from pydantic import BaseModel, Field
from app.schemas.endereco import Endereco
from app.schemas.item_pedido import ItemPedido

class Pedido(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    cliente_id: str
    endereco_entrega: Endereco
    itens: List[ItemPedido] = Field(default_factory=list)
    status: str = "PENDENTE"
    valor_total: float
    data_criacao: datetime = Field(default_factory=datetime.now)