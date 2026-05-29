from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.produto import ProdutoModel
from app.schemas.produto import Produto

def buscar_produtos_uc(db: Session, nome: Optional[str] = None, categoria: Optional[str] = None) -> List[ProdutoModel]:
    query = db.query(ProdutoModel)
    
    if nome:
        query = query.filter(ProdutoModel.nome.ilike(f"%{nome}%"))
        
    if categoria:
        query = query.filter(ProdutoModel.categoria.collate('utf8_bin') == categoria)
        
    return query.all()
