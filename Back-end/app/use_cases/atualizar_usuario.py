from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.models.usuario import UsuarioModel
from app.schemas.usuario import UsuarioBase
from .buscar_usuario_por_id import buscar_usuario_por_id

def atualizar_usuario(db: Session, usuario_id: str, dados_atualizados: UsuarioBase) -> UsuarioModel:
    usuario_db = buscar_usuario_por_id(db, usuario_id)
    
    if dados_atualizados.email != usuario_db.email:
        email_em_uso = db.query(UsuarioModel).filter(UsuarioModel.email == dados_atualizados.email).first()
        if email_em_uso:
            raise HTTPException(status_code=400, detail="Este novo e-mail já pertence a outra conta.")

    try:
        usuario_db.nome = dados_atualizados.nome
        usuario_db.email = dados_atualizados.email
        usuario_db.telefone = dados_atualizados.telefone
        
        db.commit()
        db.refresh(usuario_db)
        return usuario_db
        
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro ao atualizar os dados do usuário.")