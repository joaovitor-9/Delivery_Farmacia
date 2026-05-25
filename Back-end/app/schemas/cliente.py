from typing import List
from pydantic import Field
from app.schemas.usuario import UsuarioBase
from app.schemas.endereco import Endereco

class Cliente(UsuarioBase):
    cpf: str
    telefone: str
    enderecos: List[Endereco] = Field(default_factory=list)