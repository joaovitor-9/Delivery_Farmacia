from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from app.models.pedido import PedidoModel
from app.models.item_pedido import ItemPedidoModel

def buscar_pedidos(db: Session, cliente_id: Optional[str] = None, status: Optional[str] = None) -> List[PedidoModel]:
    query = db.query(PedidoModel).options(joinedload(PedidoModel.itens).joinedload(ItemPedidoModel.produto))
    if cliente_id:
        query = query.filter(PedidoModel.cliente_id == cliente_id)
    if status:
        query = query.filter(PedidoModel.status == status.upper())
    return query.all()