from datetime import datetime, timedelta, timezone
import jwt
from passlib.context import CryptContext
from app.security.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def gerar_hash_senha(senha: str) -> str:
    return pwd_context.hash(senha)

def verificar_senha(senha_plana: str, senha_hasheada: str) -> bool:
    return pwd_context.verify(senha_plana, senha_hasheada)

def criar_token_acesso(dados: dict) -> str:
    dados_para_codificar = dados.copy()
    
    expiracao = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_access_token_expire_minutes)
    dados_para_codificar.update({"exp": expiracao})
    
    token = jwt.encode(
        dados_para_codificar, 
        settings.jwt_secret, 
        algorithm=settings.jwt_algorithm
    )
    return token