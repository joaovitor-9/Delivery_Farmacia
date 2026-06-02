from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.usuario import UsuarioModel

def buscar_usuarios(db: Session, nome: Optional[str] = None) -> List[UsuarioModel]:
    query = db.query(UsuarioModel)
    if nome:
        query = query.filter(UsuarioModel.nome.ilike(f"%{nome}%"))
    return query.all()