from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from .buscar_usuario_por_id import buscar_usuario_por_id

def deletar_usuario(db: Session, usuario_id: str) -> dict:
    usuario_db = buscar_usuario_por_id(db, usuario_id)
    
    try:
        db.delete(usuario_db)
        db.commit()
        return {"message": "Usuário deletado com sucesso!"}
        
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400, 
            detail="Não é possível excluir este usuário pois ele possui histórico de pedidos na farmácia. Considere inativar a conta."
        )
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro interno ao tentar deletar o usuário.")