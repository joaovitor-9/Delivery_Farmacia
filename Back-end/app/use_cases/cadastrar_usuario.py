from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.models.usuario import UsuarioModel
from app.schemas.usuario import UsuarioBase

from app.security.security import gerar_hash_senha

def cadastrar_usuario(db: Session, usuario: UsuarioBase) -> UsuarioModel:
    if db.query(UsuarioModel).filter(UsuarioModel.cpf == usuario.cpf).first():
        raise HTTPException(status_code=400, detail="Este CPF já está cadastrado no sistema.")

    if db.query(UsuarioModel).filter(UsuarioModel.email == usuario.email).first():
        raise HTTPException(status_code=400, detail="Este E-mail já está em uso.")

    try:
        senha_criptografada = gerar_hash_senha(usuario.senha)

        novo_usuario = UsuarioModel(
            nome=usuario.nome,
            email=usuario.email,
            senha_hash=senha_criptografada,
            cpf=usuario.cpf, 
            telefone=usuario.telefone,
            tipo_usuario="cliente"
        )
        db.add(novo_usuario)
        db.commit()
        db.refresh(novo_usuario)
        return novo_usuario
        
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro interno ao tentar cadastrar o usuário.")