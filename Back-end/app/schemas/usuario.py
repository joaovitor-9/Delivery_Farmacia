from pydantic import BaseModel
from typing import Optional

class UsuarioBase(BaseModel):
    nome: str
    email: str
    senha: str 
    cpf: str
    telefone: Optional[str] = None

class Usuario(BaseModel):
    id: str
    nome: str
    email: str
    cpf: str
    telefone: Optional[str] = None

    class Config:
        from_attributes = True