from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.endereco import EnderecoModel
from app.schemas.endereco import EnderecoAtualizar

def atualizar_endereco(db: Session, endereco_id: str, usuario_id: str, dados: EnderecoAtualizar):
    endereco_existente = db.query(EnderecoModel).filter(
        EnderecoModel.id == endereco_id, 
        EnderecoModel.usuario_id == usuario_id
    ).first()

    if not endereco_existente:
        raise HTTPException(status_code=404, detail="Endereço não encontrado ou não pertence a este usuário")

    try:
        mapa_campos = {
            "logradouro": "rua",
            "numero": "numero",
            "bairro": "bairro",
            "cidade": "cidade",
            "cep": "cep",
            "complemento": "complemento"
        }

        for campo_pydantic, valor in dados.model_dump(exclude_unset=True).items():
            coluna_db = mapa_campos.get(campo_pydantic, campo_pydantic)
            setattr(endereco_existente, coluna_db, valor)

        db.commit()
        db.refresh(endereco_existente)
        return endereco_existente

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar endereço: {str(e)}")