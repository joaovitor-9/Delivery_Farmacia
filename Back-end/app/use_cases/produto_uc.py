from typing import List, Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from app.models.produto import ProdutoModel
from app.schemas.produto import ProdutoBase

def criar_produto(db: Session, produto: ProdutoBase) -> ProdutoModel:

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
            categoria=produto.categoria
        )
        db.add(novo_produto)
        db.commit()
        db.refresh(novo_produto)
        return novo_produto
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro interno ao tentar salvar o produto.")

def buscar_produtos(db: Session, nome: Optional[str] = None, categoria: Optional[str] = None) -> List[ProdutoModel]:
    query = db.query(ProdutoModel)
    
    if nome:
        query = query.filter(ProdutoModel.nome.ilike(f"%{nome}%"))
    if categoria:
        query = query.filter(ProdutoModel.categoria == categoria)
        
    return query.all()

def buscar_produto_por_id(db: Session, produto_id: str) -> ProdutoModel:
    produto = db.query(ProdutoModel).filter(ProdutoModel.id == produto_id).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado no sistema.")
    return produto

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