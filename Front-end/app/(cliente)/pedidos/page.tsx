'use client';

import { useState, useEffect } from 'react';
import styles from './pedidos.module.css';
import { apiFetch } from '@/app/utils/api';

interface Pedido {
  id: string;
  status: string; 
  valor_total: number;
  data_criacao: string;
}

export default function MeusPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidoAtivo, setPedidoAtivo] = useState<Pedido | null>(null);
  const [carregando, setCarregando] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [pedidoDetalhado, setPedidoDetalhado] = useState<any>(null); 
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);

  const abrirDetalhes = async (pedidoId: string) => {
    setModalAberto(true);
    setCarregandoDetalhes(true);
    
    try {
      const res = await apiFetch(`/pedidos/${pedidoId}`);
      if (res.ok) {
        const dados = await res.json();
        console.log("DADOS DO PEDIDO:", dados);
        setPedidoDetalhado(dados);
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
    } finally {
      setCarregandoDetalhes(false);
    }
  };

  const fecharModal = () => {
    setModalAberto(false);
    setPedidoDetalhado(null);
  };

  useEffect(() => {
    const buscarPedidos = async () => {
      try {
        const userString = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!userString || !token) {
          setCarregando(false);
          return;
        }

        const clienteId = JSON.parse(userString).id;

        const res = await apiFetch(`/pedidos?cliente_id=${clienteId}`);
        if (res.ok) {
          const dados: Pedido[] = await res.json();
          
          const dadosOrdenados = dados.sort((a, b) => 
            new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime()
          );

          setPedidos(dadosOrdenados);

          const ativo = dadosOrdenados.find(p => p.status !== 'ENTREGUE' && p.status !== 'CANCELADO');
          setPedidoAtivo(ativo || null);
        }
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarPedidos();
  }, []);

  const definirProgresso = (status: string) => {
    switch (status) {
      case 'PENDENTE': return 1;
      case 'EM PREPARO': return 2;
      case 'SAIU PARA ENTREGA': return 3;
      case 'ENTREGUE': return 4;
      default: return 0;
    }
  };

  const formatarData = (dataIso: string) => {
    if (!dataIso) return '';
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
  };

  if (carregando) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Carregando seus pedidos...</div>;
  }

  return (
    <main className={styles.container}>
      
      {pedidoAtivo && (
        <section className={styles.activeOrder}>
          <div className={styles.activeHeader}>
            <h2>Pedido #{pedidoAtivo.id.substring(0, 4).toUpperCase()}</h2>
            <p>{formatarData(pedidoAtivo.data_criacao)}</p>
          </div>

          <div className={styles.timeline}>
            {[1, 2, 3, 4].map((passo) => (
              <div 
                key={passo} 
                className={`${styles.dot} ${definirProgresso(pedidoAtivo.status) >= passo ? styles.dotFilled : ''}`}
              ></div>
            ))}
          </div>

          <div className={styles.statusLabel}>{pedidoAtivo.status}</div>
        </section>
      )}

      <section>
        <h2 className={styles.historyTitle}>Histórico de Pedidos</h2>

        {pedidos.length === 0 ? (
           <p style={{ textAlign: 'center', padding: '20px' }}>Você ainda não fez nenhum pedido.</p>
        ) : (
          <div className={styles.historyList}>
            
            <div className={`${styles.historyGrid} ${styles.tableHeader}`}>
              <div className={styles.colId}>NÚMERO DO PEDIDO</div>
              <div className={styles.colDate}>DATA</div>
              <div className={styles.colValue}>VALOR TOTAL</div>
              <div className={styles.colStatus}>STATUS</div>
              <div className={styles.colAction}></div>
            </div>

            {pedidos.map((pedido) => (
              <div key={pedido.id} className={`${styles.historyGrid} ${styles.orderCard}`}>
                
                <div className={styles.colId}>
                  <strong>Pedido #{pedido.id.substring(0, 4).toUpperCase()}</strong>
                </div>
                
                <div className={styles.colDate}>
                  {formatarData(pedido.data_criacao)}
                </div>
                
                <div className={styles.colValue}>
                  <strong>R$ {pedido.valor_total.toFixed(2).replace('.', ',')}</strong>
                </div>
                
                <div className={styles.colStatus}>
                  <span className={styles.concluidoBadge}>{pedido.status}</span>
                </div>
                
                <div className={styles.colAction}>
                  <button className={styles.detailsBtn} onClick={() => abrirDetalhes(pedido.id)}>Ver Detalhes</button>
                </div>

              </div>
            ))}

          </div>
        )}
      </section>
      
      {modalAberto && (
        <div className={styles.modalOverlay} onClick={fecharModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModalBtn} onClick={fecharModal}>X</button>
            
            <h2 style={{ color: '#1e1b4b', fontSize: '20px', marginBottom: '20px' }}>Detalhes do Pedido</h2>
            
            {carregandoDetalhes ? (
              <p style={{ textAlign: 'center', color: '#64748b' }}>Buscando itens no sistema...</p>
            ) : pedidoDetalhado ? (
              <div>
                <p><strong>Status:</strong> {pedidoDetalhado.status}</p>
                <p><strong>Valor Total:</strong> R$ {pedidoDetalhado.valor_total?.toFixed(2).replace('.', ',')}</p>
                
               <h3 style={{ marginTop: '20px', fontSize: '16px', color: '#1e1b4b', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>
                 Itens Comprados:
               </h3>
                <ul style={{ paddingLeft: '20px', marginTop: '10px', color: '#333' }}>
                  {pedidoDetalhado.itens?.map((item: any, index: number) => (
                    <li key={index} style={{ marginBottom: '8px' }}>
                      <strong>{item.quantidade}x</strong> {item.nome_produto} 
                      <span style={{ color: '#64748b', fontSize: '14px', marginLeft: '8px' }}>
                        (R$ {item.preco_unitario?.toFixed(2).replace('.', ',')} un)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p style={{ color: 'red' }}>Erro ao carregar detalhes. Tente novamente.</p>
            )}
          </div>
        </div>
      )}

    </main>
  );
}