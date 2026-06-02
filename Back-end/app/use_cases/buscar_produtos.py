from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.produto import ProdutoModel

def buscar_produtos(db: Session, nome: Optional[str] = None, categoria: Optional[str] = None) -> List[ProdutoModel]:
    query = db.query(ProdutoModel)
    
    if nome:
        query = query.filter(ProdutoModel.nome.ilike(f"%{nome}%"))
    if categoria:
        query = query.filter(ProdutoModel.categoria == categoria)
        
    return query.all()