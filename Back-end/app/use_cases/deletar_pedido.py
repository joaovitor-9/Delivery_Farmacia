from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from .buscar_pedido_por_id import buscar_pedido_por_id 

def deletar_pedido(db: Session, pedido_id: str) -> dict:
    try:
        pedido_db = buscar_pedido_por_id(db, pedido_id)
        
        db.delete(pedido_db)
        db.commit()
        return {"message": "Pedido removido do sistema com sucesso!"}
        
    except HTTPException as http_err:
        raise http_err
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro crítico ao tentar excluir o pedido do banco de dados.")
    