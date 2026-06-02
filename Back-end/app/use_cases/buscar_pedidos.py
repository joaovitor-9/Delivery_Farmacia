from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.pedido import PedidoModel

def buscar_pedidos(db: Session, cliente_id: Optional[str] = None, status: Optional[str] = None) -> List[PedidoModel]:
    query = db.query(PedidoModel)
    if cliente_id:
        query = query.filter(PedidoModel.cliente_id == cliente_id)
    if status:
        query = query.filter(PedidoModel.status == status.upper())
    return query.all()