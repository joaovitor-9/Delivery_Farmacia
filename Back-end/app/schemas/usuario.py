import uuid
from pydantic import BaseModel, Field

class UsuarioBase(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nome: str
    email: str
    senha: str 
    cpf: str