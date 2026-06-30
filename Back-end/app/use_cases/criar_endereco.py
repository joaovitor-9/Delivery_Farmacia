from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.endereco import EnderecoModel
from app.schemas.endereco import EnderecoCriar

def criar_endereco(db: Session, endereco: EnderecoCriar, usuario_id: str):
    try:
        novo_endereco = EnderecoModel(
            usuario_id=usuario_id,
            rua=endereco.logradouro,         
            cep=endereco.cep,
            numero=endereco.numero,
            bairro=endereco.bairro,
            cidade=endereco.cidade,
            complemento=endereco.complemento
        )
        
        db.add(novo_endereco)
        db.commit()
        db.refresh(novo_endereco)
        return novo_endereco
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao salvar endereço: {str(e)}")