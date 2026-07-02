import os
import uvicorn
from fastapi import FastAPI, Query, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.database import get_db, engine, Base
from app.schemas.endereco import EnderecoCriar
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

#Segurança e Token
from app.schemas.token import Token
from app.security.security import criar_token_acesso
from app.dependencies import obter_usuario_atual
from app.use_cases.fazer_login import autenticar_usuario

#Casos de Uso: Produtos
from app.use_cases.cadastrar_produto import cadastrar_produto 
from app.use_cases.buscar_produtos import buscar_produtos
from app.use_cases.buscar_produto_por_id import buscar_produto_por_id
from app.use_cases.atualizar_produto import atualizar_produto
from app.use_cases.deletar_produto import deletar_produto

#Casos de Uso: Usuários
from app.use_cases.cadastrar_usuario import cadastrar_usuario
from app.use_cases.buscar_usuarios import buscar_usuarios 
from app.use_cases.buscar_usuario_por_id import buscar_usuario_por_id
from app.use_cases.atualizar_usuario import atualizar_usuario

#Casos de Uso: Pedidos
from app.use_cases.realizar_pedido import realizar_pedido
from app.use_cases.buscar_pedidos import buscar_pedidos
from app.use_cases.buscar_pedido_por_id import buscar_pedido_por_id
from app.use_cases.atualizar_status_pedido import atualizar_status_pedido

# Casos de Uso: Endereços
from app.use_cases.criar_endereco import criar_endereco
from app.schemas.endereco import EnderecoCriar, EnderecoAtualizar
from app.use_cases.buscar_enderecos import buscar_enderecos_por_usuario
from app.use_cases.atualizar_endereco import atualizar_endereco
from app.use_cases.deletar_endereco import deletar_endereco

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

class LoginSchema(BaseModel):
    email: str
    senha: str

class AdminLogin(BaseModel):
    usuario: str
    senha: str

app = FastAPI(
    title="Farmácia Delivery API",
    description="Back-end estruturado em Casos de Uso para controle de estoque, clientes e vendas.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/produtos", response_model=List[Produto], tags=["Produtos"])
def listar_produtos(
    nome: Optional[str] = Query(None, description="Filtrar produto por nome"),
    categoria: Optional[str] = Query(None, description="Filtrar produto por categoria"),
    db: Session = Depends(get_db)
):
    return buscar_produtos(db=db, nome=nome, categoria=categoria)

@app.get("/produtos/{produto_id}", response_model=Produto, tags=["Produtos"])
def obter_produto_por_id(produto_id: str, db: Session = Depends(get_db)):
    return buscar_produto_por_id(db=db, produto_id=produto_id)

@app.post("/produtos", response_model=Produto, status_code=201, tags=["Produtos"])
def cadastrar_produto_rota(produto: ProdutoBase, db: Session = Depends(get_db)):
    return cadastrar_produto(db=db, produto=produto)

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

@app.get("/usuarios/me", response_model=Usuario, tags=["Usuários"])
def obter_usuario_por_id(usuario_atual: Usuario = Depends(obter_usuario_atual), db: Session = Depends(get_db)):
    return buscar_usuario_por_id(db=db, usuario_id=usuario_atual.id)

@app.put("/usuarios/me", response_model=Usuario, tags=["Usuários"])
def modificar_usuario(usuario: UsuarioBase, usuario_atual: Usuario = Depends(obter_usuario_atual), db: Session = Depends(get_db)):
    return atualizar_usuario(db=db, usuario_id=usuario_atual.id, dados_atualizados=usuario)

@app.post("/usuarios", response_model=Usuario, status_code=201, tags=["Usuários"])
def cadastrar_usuario_rota(usuario: UsuarioBase, db: Session = Depends(get_db)):
    return cadastrar_usuario(db=db, usuario=usuario)

@app.post("/pedidos", status_code=201, tags=["Pedidos"])
def cadastrar_pedido(
    pedido_dados: PedidoCriarSchema, 
    db: Session = Depends(get_db),
    usuario_atual: Usuario = Depends(obter_usuario_atual) 
):
    return realizar_pedido(
        db=db,
        cliente_id=usuario_atual.id, 
        endereco_id=pedido_dados.endereco_id,
        itens_carrinho=pedido_dados.itens
    )
@app.get("/pedidos", tags=["Pedidos"])
def listar_pedidos(
    cliente_id: Optional[str] = Query(None, description="Filtrar histórico por ID do cliente (Apenas Admin)"),
    status: Optional[str] = Query(None, description="Filtrar pedidos por estado operacional"),
    db: Session = Depends(get_db),
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    if usuario_atual.tipo_usuario != "cliente": 
        return buscar_pedidos(db=db, cliente_id=cliente_id, status=status)
    
    return buscar_pedidos(db=db, cliente_id=usuario_atual.id, status=status)

@app.get("/pedidos/{pedido_id}", tags=["Pedidos"])
def obter_pedido_especifico(
    pedido_id: str, 
    db: Session = Depends(get_db),
    usuario_atual: Usuario = Depends(obter_usuario_atual) 
):
    return buscar_pedido_por_id(db=db, pedido_id=pedido_id)

@app.put("/pedidos/{pedido_id}/status", tags=["Pedidos"])
def modificar_status_pedido(
    pedido_id: str, 
    novo_status: str = Query(...), 
    db: Session = Depends(get_db),
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    if usuario_atual.tipo_usuario == "cliente":
        raise HTTPException(
            status_code=403, 
            detail="Acesso negado. Apenas a farmácia pode alterar o status."
        )
    return atualizar_status_pedido(db=db, pedido_id=pedido_id, novo_status=novo_status)

@app.post("/login", response_model=Token, tags=["Autenticação"])
def fazer_login_rota(dados: LoginSchema, db: Session = Depends(get_db)):
    usuario = autenticar_usuario(db=db, email=dados.email, senha=dados.senha)
    
    if not usuario:
        raise HTTPException(
            status_code=401, 
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token_jwt = criar_token_acesso(dados={"sub": usuario.email})
    
    return {
        "access_token": token_jwt, 
        "token_type": "bearer",
        "user": {
            "id": str(usuario.id),
            "nome": usuario.nome
        }
    }

@app.post("/enderecos", status_code=201, tags=["Endereços"])
def cadastrar_endereco_rota(
    endereco: EnderecoCriar, 
    db: Session = Depends(get_db),
    usuario_atual: Usuario = Depends(obter_usuario_atual) 
):
    novo_endereco = criar_endereco(db=db, endereco=endereco, usuario_id=usuario_atual.id)
    return {"id": novo_endereco.id, "mensagem": "Endereço salvo com sucesso"}

@app.get("/enderecos", tags=["Endereços"])
def rota_listar_enderecos(
    db: Session = Depends(get_db),
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    return buscar_enderecos_por_usuario(db=db, usuario_id=usuario_atual.id)

@app.put("/enderecos/{endereco_id}", tags=["Endereços"])
def rota_atualizar_endereco(
    endereco_id: str, 
    dados: EnderecoAtualizar,
    usuario_atual: Usuario = Depends(obter_usuario_atual), 
    db: Session = Depends(get_db)
):
    return atualizar_endereco(db=db, endereco_id=endereco_id, usuario_id=usuario_atual.id, dados=dados)

@app.delete("/enderecos/{endereco_id}", tags=["Endereços"])
def rota_deletar_endereco(endereco_id: str, usuario_atual: Usuario = Depends(obter_usuario_atual), db: Session = Depends(get_db)):
    return deletar_endereco(db=db, endereco_id=endereco_id, usuario_id=usuario_atual.id)

@app.post("/login/admin", tags=["Autenticação"])
def login_admin(dados: AdminLogin):
    if dados.usuario == "admin" and dados.senha == "123":
        from app.security.security import criar_token_acesso 
        token_jwt = criar_token_acesso(dados={"sub": "admin@farmacia.com"})
        
        return {
            "access_token": token_jwt, 
            "token_type": "bearer",
            "user": {"nome": "Administrador", "tipo": "admin"}
        }
    
    raise HTTPException(status_code=401, detail="Credenciais de admin inválidas")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)