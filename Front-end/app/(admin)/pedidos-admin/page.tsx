import React from 'react';
import styles from './pedidosKanban.module.css';

const mockPedidos = [
  { id: '0006', cliente: 'João', itens: ['Dipirona 500mg - 1und'], total: 'R$ 9,90', status: 'novos' },
  { id: '0005', cliente: 'Maria', itens: ['Dorflex 36 Comp. - 1und'], total: 'R$ 22,50', status: 'novos' },
  { id: '0004', cliente: 'José', itens: ['Vitamina C - 1und'], total: 'R$ 18,90', status: 'separacao' },
  { id: '0002', cliente: 'Ana', itens: ['Neosaldina - 1und', 'Ibuprofeno - 1und'], total: 'R$ 44,90', status: 'saindo' },
  { id: '0001', cliente: 'Pedro', itens: ['Dipirona 500mg - 1und'], total: 'R$ 9,90', status: 'entregue' },
];

export default function PedidosPage() {
  const colunas = [
    { id: 'novos', titulo: 'Novos Pedidos' },
    { id: 'separacao', titulo: 'Em Separação' },
    { id: 'saindo', titulo: 'Saindo para Entrega' },
    { id: 'entregue', titulo: 'Entregue' }
  ];

  return (
    <div className={styles.kanbanWrapper}>
      <h1 className={styles.pageTitle}>Quadro de Pedidos</h1>
      
      <div className={styles.kanbanBoard}>
        {colunas.map((coluna) => (
          <div key={coluna.id} className={styles.coluna}>
            <div className={styles.colunaHeader}>
              <h2 className={styles.tituloColuna}>{coluna.titulo}</h2>
              <span className={styles.contador}>
                {mockPedidos.filter(p => p.status === coluna.id).length}
              </span>
            </div>
            
            <div className={styles.listaCards}>
              {mockPedidos
                .filter((pedido) => pedido.status === coluna.id)
                .map((pedido) => (
                  <div key={pedido.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3>#{pedido.id}</h3>
                      <p>{pedido.cliente}</p>
                    </div>
                    <div className={styles.cardBody}>
                      {pedido.itens.map((item, index) => (
                        <p key={index} className={styles.item}>{item}</p>
                      ))}
                    </div>
                    <div className={styles.cardFooter}>
                      <strong>{pedido.total}</strong>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}