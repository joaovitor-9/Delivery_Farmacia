from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.models.produto import ProdutoModel
from app.schemas.produto import ProdutoBase
from .buscar_produto_por_id import buscar_produto_por_id 

def atualizar_produto(db: Session, produto_id: str, dados_atualizados: ProdutoBase) -> ProdutoModel:
    if dados_atualizados.preco <= 0:
        raise HTTPException(status_code=400, detail="O preço do produto deve ser maior que zero.")
    if dados_atualizados.estoque < 0:
        raise HTTPException(status_code=400, detail="O estoque não pode ser negativo.")

    try:
        produto_db = buscar_produto_por_id(db, produto_id)
        
        produto_db.nome = dados_atualizados.nome
        produto_db.descricao = dados_atualizados.descricao
        produto_db.preco = dados_atualizados.preco
        produto_db.estoque = dados_atualizados.estoque
        produto_db.categoria = dados_atualizados.categoria
        
        db.commit()
        db.refresh(produto_db)
        return produto_db
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro interno ao tentar atualizar o produto.")