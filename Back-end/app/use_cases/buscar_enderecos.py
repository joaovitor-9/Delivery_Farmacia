from sqlalchemy.orm import Session
from app.models.endereco import EnderecoModel

def buscar_enderecos_por_usuario(db: Session, usuario_id: str):
    return db.query(EnderecoModel).filter(EnderecoModel.usuario_id == usuario_id).all()