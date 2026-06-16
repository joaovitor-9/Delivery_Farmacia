from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.models.produto import ProdutoModel
from app.schemas.produto import ProdutoBase

def cadastrar_produto(db: Session, produto: ProdutoBase) -> ProdutoModel:
    if produto.preco <= 0:
        raise HTTPException(status_code=400, detail="O preço do produto deve ser maior que zero.")
    if produto.estoque < 0:
        raise HTTPException(status_code=400, detail="O estoque não pode ser negativo.")

    produto_existente = db.query(ProdutoModel).filter(ProdutoModel.nome.ilike(produto.nome)).first()
    if produto_existente:
        raise HTTPException(status_code=400, detail="Já existe um produto cadastrado com este exato nome.")

    try:
        novo_produto = ProdutoModel(
            nome=produto.nome,
            descricao=produto.descricao,
            preco=produto.preco,
            estoque=produto.estoque,
            categoria=produto.categoria,
            subcategoria=produto.subcategoria,
            imagem_url=produto.imagem_url
        )
        db.add(novo_produto)
        db.commit()
        db.refresh(novo_produto)
        return novo_produto
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro interno ao tentar salvar o produto.")