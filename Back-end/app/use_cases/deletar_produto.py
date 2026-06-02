from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from .buscar_produto_por_id import buscar_produto_por_id 

def deletar_produto(db: Session, produto_id: str) -> dict:
    produto_db = buscar_produto_por_id(db, produto_id)
    
    try:
        db.delete(produto_db)
        db.commit()
        return {"message": "Produto excluído com sucesso!"}
        
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400, 
            detail="Não é possível excluir este produto pois ele já faz parte de pedidos antigos. Considere zerar o estoque em vez de excluir."
        )
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro ao tentar excluir o produto.")