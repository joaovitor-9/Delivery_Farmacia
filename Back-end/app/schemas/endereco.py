import re
import uuid
from typing import Optional
from pydantic import BaseModel, Field, field_validator


def _normalizar_cep(v: Optional[str]) -> Optional[str]:
    if v is None:
        return v
    v = re.sub(r'\D', '', v)
    if not re.fullmatch(r'\d{8}', v):
        raise ValueError('O CEP deve conter exatamente 8 dígitos numéricos.')
    return v


class Endereco(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    logradouro: str
    numero: str
    bairro: str
    cidade: str
    cep: str

class EnderecoCriar(BaseModel):
    cep: str
    logradouro: str
    numero: str
    bairro: str
    cidade: str
    complemento: Optional[str] = None

    @field_validator('cep')
    @classmethod
    def validar_cep(cls, v: str):
        return _normalizar_cep(v)

class EnderecoAtualizar(BaseModel):
    cep: Optional[str] = None
    logradouro: Optional[str] = None
    numero: Optional[str] = None
    bairro: Optional[str] = None
    cidade: Optional[str] = None
    complemento: Optional[str] = None

    @field_validator('cep')
    @classmethod
    def validar_cep(cls, v: Optional[str]):
        return _normalizar_cep(v)
