from app.schemas.usuario import UsuarioBase

class Funcionario(UsuarioBase):
    matricula: str
    cargo: str