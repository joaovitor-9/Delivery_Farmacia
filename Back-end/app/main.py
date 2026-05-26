from fastapi import FastAPI, Query, Depends
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.schemas.produto import Produto
from app.use_cases.buscar_produtos import buscar_produtos_uc
# Não precisamos mais importar o ProdutoModel aqui no main.py!

app = FastAPI(title="Farmácia Delivery API")

@app.get("/produtos", response_model=List[Produto], tags=["Produtos"])
def buscar_produtos(
    nome: Optional[str] = Query(None),
    categoria: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    return buscar_produtos_uc(db=db, nome=nome, categoria=categoria)