from fastapi import FastAPI, Query, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.database import get_db, engine, Base
from app.models.usuario import UsuarioModel
from app.models.endereco import EnderecoModel
from app.models.produto import ProdutoModel
from app.models.pedido import PedidoModel
from app.models.item_pedido import ItemPedidoModel
from app.models.funcionario import FuncionarioModel

Base.metadata.create_all(bind=engine)

from app.schemas.produto import Produto, ProdutoBase
from app.schemas.usuario import Usuario, UsuarioBase

class ItemCarrinhoSchema(BaseModel):
    produto_id: str
    quantidade: int

class PedidoCriarSchema(BaseModel):
    cliente_id: str
    endereco_id: str
    itens: List[ItemCarrinhoSchema]

from app.use_cases.produto_uc import (
    criar_produto,
    buscar_produtos,
    buscar_produto_por_id,
    atualizar_produto,
    deletar_produto
)
from app.use_cases.usuario_uc import (
    cadastrar_usuario,
    buscar_usuarios,
    buscar_usuario_por_id,
    atualizar_usuario,
    deletar_usuario
)
from app.use_cases.pedido_uc import (
    realizar_pedido,
    buscar_pedidos,
    buscar_pedido_por_id,
    atualizar_status_pedido,
    deletar_pedido
)
app = FastAPI(
    title="Farmácia Delivery API",
    description="Back-end estruturado em Casos de Uso para controle de estoque, clientes e vendas.",
    version="1.0.0"
)
@app.get("/produtos", response_model=List[Produto], tags=["Produtos"])
def listar_produtos(
    nome: Optional[str] = Query(None, description="Filtrar produto por nome"),
    categoria: Optional[str] = Query(None, description="Filtrar produto por categoria"),
    db: Session = Depends(get_db)
):
    return buscar_produtos(db=db, nome=nome, category=categoria)

@app.get("/produtos/{produto_id}", response_model=Produto, tags=["Produtos"])
def obter_produto_por_id(produto_id: str, db: Session = Depends(get_db)):
    return buscar_produto_por_id(db=db, produto_id=produto_id)

@app.post("/produtos", response_model=Produto, status_code=201, tags=["Produtos"])
def cadastrar_produto(produto: ProdutoBase, db: Session = Depends(get_db)):
    return criar_produto(db=db, produto=produto)

@app.put("/produtos/{produto_id}", response_model=Produto, tags=["Produtos"])
def modificar_produto(produto_id: str, produto: ProdutoBase, db: Session = Depends(get_db)):
    return atualizar_produto(db=db, produto_id=produto_id, dados_atualizados=produto)

@app.delete("/produtos/{produto_id}", tags=["Produtos"])
def remover_produto(produto_id: str, db: Session = Depends(get_db)):
    return deletar_produto(db=db, produto_id=produto_id)

@app.get("/usuarios", response_model=List[Usuario], tags=["Usuários"])
def listar_usuarios(
    nome: Optional[str] = Query(None, description="Filtrar por nome de usuário"),
    db: Session = Depends(get_db)
):
    return buscar_usuarios(db=db, nome=nome)

@app.get("/usuarios/{usuario_id}", response_model=Usuario, tags=["Usuários"])
def obter_usuario_por_id(usuario_id: str, db: Session = Depends(get_db)):
    return buscar_usuario_por_id(db=db, usuario_id=usuario_id)

@app.post("/usuarios", response_model=Usuario, status_code=201, tags=["Usuários"])
def cadastrar_usuario(usuario: UsuarioBase, db: Session = Depends(get_db)):
    return cadastrar_usuario(db=db, usuario=usuario)

@app.put("/usuarios/{usuario_id}", response_model=Usuario, tags=["Usuários"])
def modificar_usuario(usuario_id: str, usuario: UsuarioBase, db: Session = Depends(get_db)):
    return atualizar_usuario(db=db, usuario_id=usuario_id, dados_atualizados=usuario)

@app.delete("/usuarios/{usuario_id}", tags=["Usuários"])
def remover_usuario(usuario_id: str, db: Session = Depends(get_db)):
    return deletar_usuario(db=db, usuario_id=usuario_id)

@app.post("/pedidos", status_code=201, tags=["Pedidos"])
def cadastrar_pedido(pedido_dados: PedidoCriarSchema, db: Session = Depends(get_db)):
    return realizar_pedido(
        db=db,
        cliente_id=pedido_dados.cliente_id,
        endereco_id=pedido_dados.endereco_id,
        itens_carrinho=pedido_dados.itens
    )

@app.get("/pedidos", tags=["Pedidos"])
def listar_pedidos(
    cliente_id: Optional[str] = Query(None, description="Filtrar histórico por ID do cliente"),
    status: Optional[str] = Query(None, description="Filtrar pedidos por estado operacional"),
    db: Session = Depends(get_db)
):
    return buscar_pedidos(db=db, cliente_id=cliente_id, status=status)

@app.get("/pedidos/{pedido_id}", tags=["Pedidos"])
def obter_pedido_especifico(pedido_id: str, db: Session = Depends(get_db)):
    return buscar_pedido_por_id(db=db, pedido_id=pedido_id)

@app.put("/pedidos/{pedido_id}/status", tags=["Pedidos"])
def modificar_status_pedido(pedido_id: str, novo_status: str = Query(...), db: Session = Depends(get_db)):
    return atualizar_status_pedido(db=db, pedido_id=pedido_id, novo_status=novo_status)

@app.delete("/pedidos/{pedido_id}", tags=["Pedidos"])
def cancelar_pedido(pedido_id: str, db: Session = Depends(get_db)):
    return deletar_pedido(db=db, pedido_id=pedido_id)