from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.usuario import UsuarioModel

def fazer_login(db: Session, email: str, senha: str) -> UsuarioModel:
    print(f"--- TENTATIVA DE LOGIN ---")
    print(f"Email recebido: '{email}'")
    print(f"Senha recebida: '{senha}'")
    usuario = db.query(UsuarioModel).filter(UsuarioModel.email == email).first()
    
    if not usuario:
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos.")
    
    senha_esperada = f"hash_seguro_{senha}"
    if usuario.senha_hash != senha_esperada:
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos.")
        
    return usuario