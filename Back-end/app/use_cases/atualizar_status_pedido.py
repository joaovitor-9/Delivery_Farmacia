from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.models.pedido import PedidoModel

def atualizar_status_pedido(db: Session, pedido_id: str, novo_status: str) -> PedidoModel:
    status_permitidos = ["PENDENTE", "EM PREPARO", "SAIU PARA ENTREGA", "ENTREGUE", "CANCELADO"]
    novo_status = novo_status.upper() 
    
    if novo_status not in status_permitidos:
        raise HTTPException(
            status_code=400, 
            detail=f"Status inválido. Escolha uma das opções: {', '.join(status_permitidos)}"
        )
        
    try:
        pedido_db = db.query(PedidoModel).filter(PedidoModel.id == pedido_id).first()
        
    
        if not pedido_db:
            raise HTTPException(status_code=404, detail="Pedido não encontrado")
            
    
        pedido_db.status = novo_status
        
        db.commit()
        db.refresh(pedido_db)
        return pedido_db
        
    except HTTPException as http_err:
        raise http_err
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro interno ao tentar atualizar o status do pedido.")