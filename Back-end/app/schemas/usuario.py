from pydantic import BaseModel, field_validator, Field
from typing import Optional
import re

class UsuarioBase(BaseModel):
    nome: str
    email: str
    senha: str = Field(..., max_length=72)
    cpf: str
    telefone: Optional[str] = None

    @field_validator('cpf')
    @classmethod
    def validar_cpf(cls, v: str):
        if not re.match(r'^\d{11}$', v):
            raise ValueError('O CPF deve conter exatamente 11 dígitos numéricos.')
        return v

    @field_validator('email')
    @classmethod
    def validar_email(cls, v: str):
        email_limpo = v.lower()
        if not email_limpo.endswith('@gmail.com'):
            raise ValueError('Apenas e-mails @gmail.com são permitidos.')
        return email_limpo

class Usuario(BaseModel):
    id: str
    nome: str
    email: str
    cpf: str
    telefone: Optional[str] = None

    class Config:
        from_attributes = True