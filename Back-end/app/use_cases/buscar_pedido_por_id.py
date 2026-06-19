from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.pedido import PedidoModel

def buscar_pedido_por_id(db: Session, pedido_id: str):
    pedido = db.query(PedidoModel).filter(PedidoModel.id == pedido_id).first()
    
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
        
    return {
        "id": pedido.id,
        "cliente_id": pedido.cliente_id,
        "endereco_id": pedido.endereco_id,
        "status": pedido.status,
        "valor_total": pedido.valor_total,
        "data_criacao": pedido.data_criacao,
        "itens": [
            {
                "produto_id": item.produto_id,
                "nome_produto": item.produto.nome, 
                "quantidade": item.quantidade,
                "preco_unitario": item.preco_unitario
            } 
            for item in pedido.itens
        ]
    }