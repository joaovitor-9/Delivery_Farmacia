import uuid
from pydantic import BaseModel, Field

class Endereco(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    logradouro: str
    numero: str
    bairro: str
    cidade: str
    cep: str