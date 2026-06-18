from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.endereco import EnderecoModel

def deletar_endereco(db: Session, endereco_id: str, usuario_id: str):
    # Busca o endereço garantindo a propriedade do usuário antes de deletar
    endereco = db.query(EnderecoModel).filter(
        EnderecoModel.id == endereco_id, 
        EnderecoModel.usuario_id == usuario_id
    ).first()

    if not endereco:
        raise HTTPException(status_code=404, detail="Endereço não encontrado ou não pertence a este usuário")

    try:
        db.delete(endereco)
        db.commit()
        return {"status": "Sucesso", "mensagem": "Endereço removido com sucesso"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao deletar endereço: {str(e)}")