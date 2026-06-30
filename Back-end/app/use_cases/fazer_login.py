from sqlalchemy.orm import Session
from app.models.usuario import UsuarioModel
from app.security.security import verificar_senha

def autenticar_usuario(db: Session, email: str, senha: str):
    print(f"--- TENTATIVA DE LOGIN COM JWT ---")
    print(f"Email recebido: '{email}'")
    
    usuario = db.query(UsuarioModel).filter(UsuarioModel.email == email).first()
    
    if not usuario:
        print("Falha: Usuário não encontrado no banco.")
        return None
        

    if not verificar_senha(senha, usuario.senha_hash):
        print("Falha: Senha incorreta.")
        return None
        
    print("Sucesso: Login aprovado!")
    return usuario