from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.produto import ProdutoModel

def buscar_produto_por_id(db: Session, produto_id: str):
    produto = db.query(ProdutoModel).filter(ProdutoModel.id == produto_id).first()
    
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
        
    return produto