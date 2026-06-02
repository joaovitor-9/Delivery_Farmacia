from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.models.pedido import PedidoModel
from app.models.item_pedido import ItemPedidoModel
from app.models.produto import ProdutoModel

def realizar_pedido(db: Session, cliente_id: str, endereco_id: str, itens_carrinho: list) -> PedidoModel:
    if not itens_carrinho:
        raise HTTPException(status_code=400, detail="Não é possível criar um pedido sem itens.")

    valor_total_calculado = 0.0

    try:
        for item in itens_carrinho:
            produto_db = db.query(ProdutoModel).filter(ProdutoModel.id == item.produto_id).first()
            
            if not produto_db:
                raise HTTPException(
                    status_code=404, 
                    detail=f"Produto com ID {item.produto_id} não foi encontrado na prateleira."
                )
                
            if produto_db.estoque < item.quantidade:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Estoque insuficiente para {produto_db.nome}. Restam apenas {produto_db.estoque} unidades."
                )
            valor_total_calculado += (produto_db.preco * item.quantidade)
        
            produto_db.estoque -= item.quantidade

        novo_pedido = PedidoModel(
            valor_total=valor_total_calculado, 
            cliente_id=cliente_id,   
            endereco_id=endereco_id,
            status="PENDENTE" 
        )
        db.add(novo_pedido)
        db.flush()  

        for item in itens_carrinho:
            produto_db = db.query(ProdutoModel).filter(ProdutoModel.id == item.produto_id).first()
            
            novo_item = ItemPedidoModel(
                pedido_id=novo_pedido.id,
                produto_id=item.produto_id,
                quantidade=item.quantidade,
                preco_unitario=produto_db.preco  
            )
            db.add(novo_item)

        db.commit()
        db.refresh(novo_pedido)
        return novo_pedido

    except HTTPException as http_err:
        db.rollback()
        raise http_err
        
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400, 
            detail="Operação recusada: O Cliente ou o Endereço informado não existe no sistema."
        )
        
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500, 
            detail="Erro interno no servidor ao tentar processar e salvar o pedido."
        )