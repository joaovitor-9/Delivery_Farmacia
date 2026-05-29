from typing import List, Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.models.usuario import UsuarioModel
from app.schemas.usuario import UsuarioBase

def cadastrar_usuario(db: Session, usuario: UsuarioBase) -> UsuarioModel:
    if db.query(UsuarioModel).filter(UsuarioModel.cpf == usuario.cpf).first():
        raise HTTPException(status_code=400, detail="Este CPF já está cadastrado no sistema.")

    if db.query(UsuarioModel).filter(UsuarioModel.email == usuario.email).first():
        raise HTTPException(status_code=400, detail="Este E-mail já está em uso.")

    try:
        senha_criptografada = f"hash_seguro_{usuario.senha}"

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


def buscar_usuarios(db: Session, nome: Optional[str] = None) -> List[UsuarioModel]:
    query = db.query(UsuarioModel)
    if nome:
        query = query.filter(UsuarioModel.nome.ilike(f"%{nome}%"))
    return query.all()

def buscar_usuario_por_id(db: Session, usuario_id: str) -> UsuarioModel:
    usuario = db.query(UsuarioModel).filter(UsuarioModel.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    return usuario

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

def deletar_usuario(db: Session, usuario_id: str) -> dict:
    usuario_db = buscar_usuario_por_id(db, usuario_id)
    
    try:
        db.delete(usuario_db)
        db.commit()
        return {"message": "Usuário deletado com sucesso!"}
        
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400, 
            detail="Não é possível excluir este usuário pois ele possui histórico de pedidos na farmácia. Considere inativar a conta."
        )
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro interno ao tentar deletar o usuário.")