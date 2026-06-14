'use client'

import React, { useEffect, useState } from 'react';
import styles from './pedidosKanban.module.css';

interface ProdutoInfo {
  nome: string;
}

interface ItemPedido {
  produto_id: string;
  quantidade: number;
  produto?: ProdutoInfo;
}

interface Pedido {
  id: string;
  cliente_id: string;
  status: string;
  valor_total: number;
  itens: ItemPedido[];
  nome_cliente?: string;
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);


  const colunas = [
    { id: 'PENDENTE', titulo: 'Novos Pedidos' },
    { id: 'EM PREPARO', titulo: 'Em Separação' },
    { id: 'SAIU PARA ENTREGA', titulo: 'Saindo para Entrega' },
    { id: 'ENTREGUE', titulo: 'Entregue' }
  ];


  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pedidos`);
      if (res.ok) {
        const dados = await res.json();
        const pedidosComNome = dados.map((p: Pedido) => ({
          ...p,
          nome_cliente: p.nome_cliente || 'Cliente ' + p.cliente_id.substring(0,4)
        }));
        setPedidos(pedidosComNome);
      }
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    } finally {
      setCarregando(false);
    }
  };


  const handleDragStart = (e: React.DragEvent, pedidoId: string) => {
    e.dataTransfer.setData("pedidoId", pedidoId);
    setTimeout(() => { (e.target as HTMLElement).style.opacity = '0.5'; }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, novoStatus: string) => {
    e.preventDefault();
    const pedidoId = e.dataTransfer.getData("pedidoId");

    const pedidoArrastado = pedidos.find(p => p.id === pedidoId);
    if (!pedidoArrastado || pedidoArrastado.status === novoStatus) return;

    
    setPedidos(atuais => atuais.map(p => p.id === pedidoId ? { ...p, status: novoStatus } : p));

    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pedidos/${pedidoId}/status?novo_status=${novoStatus}`, {
        method: 'PUT',
      });
      
      if (!res.ok) {
        alert("Erro ao atualizar o status no banco.");
        carregarPedidos(); 
      }
    } catch (error) {
      console.error("Erro de conexão ao atualizar:", error);
      carregarPedidos(); 
    }
  };

  if (carregando) {
    return <div className={styles.kanbanWrapper}><h3 style={{color: '#fff', padding: '20px'}}>Carregando quadro...</h3></div>;
  }


  return (
    <div className={styles.kanbanWrapper}>
      <h1 className={styles.pageTitle}>Quadro de Pedidos</h1>
      
      <div className={styles.kanbanBoard}>
        {colunas.map((coluna) => {
          const pedidosDaColuna = pedidos.filter(p => p.status === coluna.id);

          return (
            <div 
              key={coluna.id} 
              className={styles.coluna}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, coluna.id)}
            >
              <div className={styles.colunaHeader}>
                <h2 className={styles.tituloColuna}>{coluna.titulo}</h2>
                <span className={styles.contador}>
                  {pedidosDaColuna.length}
                </span>
              </div>
              
              <div className={styles.listaCards}>
                {pedidosDaColuna.map((pedido) => (
                  <div 
                    key={pedido.id} 
                    className={styles.card}
                    draggable 
                    onDragStart={(e) => handleDragStart(e, pedido.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className={styles.cardHeader}>
                      <h3>#{pedido.id.substring(0, 4).toUpperCase()}</h3>
                      <p>{pedido.nome_cliente}</p>
                    </div>
                    <div className={styles.cardBody}>
                      {pedido.itens?.map((item, index) => (
                        <p key={index} className={styles.item}>
                          {item.produto?.nome ? (
                            <span>
                              <strong>{item.produto.nome}</strong> (ID: {item.produto_id.substring(0,4)}) - {item.quantidade}und
                            </span>
                          ) : (
                            <span>Produto ID: {item.produto_id.substring(0,4)} - {item.quantidade}und</span>
                          )}
                        </p>
                      ))}
                      
                      {(!pedido.itens || pedido.itens.length === 0) && (
                        <p className={styles.item} style={{ fontStyle: 'italic', opacity: 0.7 }}>
                          Itens não carregados na listagem.
                        </p>
                      )}
                    </div>
                    <div className={styles.cardFooter}>
                      <strong>R$ {pedido.valor_total.toFixed(2).replace('.', ',')}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}