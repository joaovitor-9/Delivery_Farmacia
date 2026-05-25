import styles from './pedidos.module.css';

export default function Pedidos() {
  const historico = [
    { id: "#0004", data: "Ontem", valor: "R$ 45,95", status: "Concluído" },
    { id: "#0003", data: "20 abr", valor: "R$ 22,90", status: "Concluído" },
    { id: "#0002", data: "5 abr", valor: "R$ 17,75", status: "Concluído" },
    { id: "#0001", data: "20 mar", valor: "R$ 55,80", status: "Concluído" },
  ];

  return (
    <main className={styles.container}>
      
      <div className={styles.activeOrder}>
        <div className={styles.activeHeader}>
          <h2>Pedido #0005</h2>
          <p>Hoje, 14:00</p>
        </div>

        <div className={styles.timeline}>
          <div className={`${styles.dot} ${styles.dotFilled}`}></div>
          <div className={`${styles.dot} ${styles.dotFilled}`}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>

        <div className={styles.statusLabel}>Em Separação</div>
      </div>

      <h2 className={styles.historyTitle}>Histórico de Pedidos</h2>

      <div className={styles.historyList}>
        
        <div className={`${styles.historyGrid} ${styles.tableHeader}`}>
          <div className={styles.colId}>Número do Pedido</div>
          <div className={styles.colDate}>Data</div>
          <div className={styles.colValue}>Valor Total</div>
          <div className={styles.colStatus}>Status</div>
          <div className={styles.colAction}></div>
        </div>

        {historico.map((pedido) => (
          <div key={pedido.id} className={`${styles.historyGrid} ${styles.orderCard}`}>
            <div className={styles.colId}>
              <strong>Pedido {pedido.id}</strong>
            </div>
            
            <div className={styles.colDate}>
              {pedido.data}
            </div>
            
            <div className={styles.colValue}>
              <strong>{pedido.valor}</strong>
            </div>
            
            <div className={styles.colStatus}>
              <span className={styles.concluidoBadge}>{pedido.status}</span>
            </div>
            
            <div className={styles.colAction}>
              <button className={styles.detailsBtn}>Ver Detalhes</button>
            </div>
          </div>
        ))}
        
      </div>
    </main>
  );
}