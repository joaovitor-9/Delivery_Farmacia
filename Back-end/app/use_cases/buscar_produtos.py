# app/use_cases/buscar_produtos.py
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.produto import ProdutoModel
from app.schemas.produto import Produto

def buscar_produtos_uc(db: Session, nome: Optional[str] = None, categoria: Optional[str] = None) -> List[ProdutoModel]:
    # Inicia uma query na tabela de produtos
    query = db.query(ProdutoModel)
    
    if nome:
        # Equivalente ao LIKE do SQL (busca parcial ignorando maiúsculas/minúsculas)
        query = query.filter(ProdutoModel.nome.ilike(f"%{nome}%"))
        
    if categoria:
        # Filtro exato de categoria
        query = query.filter(ProdutoModel.categoria.collate('utf8_bin') == categoria) # ou apenas == se o banco for case-sensitive padrão
        
    return query.all()