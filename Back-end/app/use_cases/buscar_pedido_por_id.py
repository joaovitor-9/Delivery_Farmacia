from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.pedido import PedidoModel

def buscar_pedido_por_id(db: Session, pedido_id: str) -> PedidoModel:
    pedido = db.query(PedidoModel).filter(PedidoModel.id == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado.")
    return pedido