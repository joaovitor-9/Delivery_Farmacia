from fastapi import FastAPI, Query, Depends
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db, engine, Base
from app.models.usuario import UsuarioModel
from app.models.endereco import EnderecoModel
from app.models.produto import ProdutoModel
from app.models.pedido import PedidoModel
from app.models.item_pedido import ItemPedidoModel
from app.models.funcionario import FuncionarioModel

Base.metadata.create_all(bind=engine)

from app.schemas.produto import Produto
from app.use_cases.buscar_produtos import buscar_produtos_uc

app = FastAPI(title="Farmácia Delivery API")

@app.get("/produtos", response_model=List[Produto], tags=["Produtos"])
def buscar_produtos(
    nome: Optional[str] = Query(None, description="Buscar produto por nome"),
    categoria: Optional[str] = Query(None, description="Buscar produto por categoria"),
    db: Session = Depends(get_db)
):
    return buscar_produtos_uc(db=db, nome=nome, categoria=categoria)