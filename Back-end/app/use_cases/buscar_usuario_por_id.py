from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.usuario import UsuarioModel

def buscar_usuario_por_id(db: Session, usuario_id: str) -> UsuarioModel:
    usuario = db.query(UsuarioModel).filter(UsuarioModel.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    return usuario