"use client"; 

import React, { useState, useEffect } from 'react';
import styles from './dashboard.module.css';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

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
  status: string;
  valor_total: number;
  data_criacao: string;
  itens: ItemPedido[];
}

export default function DashboardPage() {
  const [montado, setMontado] = useState(false);
  
  const [metricas, setMetricas] = useState({ vendasHoje: 0, pendentes: 0, separacao: 0, entregues: 0 });
  const [dadosFaturamento, setDadosFaturamento] = useState<any[]>([]);
  const [dadosProdutos, setDadosProdutos] = useState<any[]>([]);

  useEffect(() => {
    setMontado(true);
    buscarEProcessarDados();
  }, []);

  const buscarEProcessarDados = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pedidos`, {
        cache: 'no-store'
      });
      if (res.ok) {
        const pedidos: Pedido[] = await res.json();
        console.log("PEDIDOS DETALHADOS:", JSON.stringify(pedidos, null, 2));
        processarMetricas(pedidos);
        processarFaturamentoSemanal(pedidos);
        processarProdutosMaisVendidos(pedidos);
      }
    } catch (error) {
      console.error("Erro ao buscar pedidos para o dashboard:", error);
    }
  };


  const processarMetricas = (pedidos: Pedido[]) => {
    const hoje = new Date().toLocaleDateString('pt-BR');
    let vHoje = 0; let pend = 0; let sep = 0; let entr = 0;

    pedidos.forEach(p => {
      if (p.status === 'PENDENTE') pend++;
      if (p.status === 'EM PREPARO') sep++;
      if (p.status === 'ENTREGUE') entr++;

      const dataPedido = p.data_criacao ? new Date(p.data_criacao + 'Z').toLocaleDateString('pt-BR') : '';
      if (dataPedido === hoje && p.status !== 'CANCELADO') {
        vHoje += p.valor_total;
      }
    });

    setMetricas({ vendasHoje: vHoje, pendentes: pend, separacao: sep, entregues: entr });
  };

  const processarFaturamentoSemanal = (pedidos: Pedido[]) => {
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const ultimos7Dias = [];
    
    for(let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      ultimos7Dias.push(d);
    }

    const faturamentoCalculado = ultimos7Dias.map(data => {
      const dataFormatada = data.toLocaleDateString('pt-BR');
      const totalDia = pedidos
        .filter(p => p.data_criacao && new Date(p.data_criacao + 'Z').toLocaleDateString('pt-BR') === dataFormatada && p.status !== 'CANCELADO')
        .reduce((acc, p) => acc + p.valor_total, 0);

      return { dia: diasSemana[data.getDay()], valor: totalDia };
    });

    setDadosFaturamento(faturamentoCalculado);
  };

  const processarProdutosMaisVendidos = (pedidos: Pedido[]) => {
    const contagem: Record<string, number> = {};

    pedidos.forEach(p => {
      if (p.status !== 'CANCELADO') { 
        p.itens?.forEach(item => {
          const nomeProduto = item.produto?.nome || `ID: ${item.produto_id.substring(0,4)}`;
          contagem[nomeProduto] = (contagem[nomeProduto] || 0) + item.quantidade;
        });
      }
    });

    const arrayRankeado = Object.entries(contagem)
      .map(([nome, qtd]) => ({ nome, qtd }))
      .sort((a, b) => b.qtd - a.qtd)
      .slice(0, 5);

    setDadosProdutos(arrayRankeado);
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.pageTitle}>Visão Geral de Vendas</h1>
       
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <h3>Vendas Hoje</h3>
          <p className={styles.metricValue}>
            R$ {metricas.vendasHoje.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <div className={styles.metricCard}>
          <h3>Pedidos Pendentes</h3>
          <p className={styles.metricValue}>{metricas.pendentes}</p>
        </div>
        <div className={styles.metricCard}>
          <h3>Aguardando Separação</h3>
          <p className={styles.metricValue}>{metricas.separacao}</p>
        </div>
        <div className={styles.metricCard}>
          <h3>Entregas Concluídas</h3>
          <p className={styles.metricValue}>{metricas.entregues}</p>
        </div>
      </div>

      <div className={styles.chartsArea}>
        
        <div className={styles.chartBox}>
          <h3>Faturamento Semanal</h3>
          <div style={{ width: '100%', height: 300, marginTop: '1rem', position: 'relative' }}>
            {montado && dadosFaturamento.length > 0 && (
              <ResponsiveContainer width="99%" height="100%" minWidth={1} minHeight={1}>
                <LineChart data={dadosFaturamento} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="dia" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                  <Tooltip 
                    formatter={(value: any) => [`R$ ${Number(value).toFixed(2)}`, 'Faturamento']}
                    labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="valor" stroke="#2e269f" strokeWidth={3} dot={{ r: 4, fill: '#2e269f' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className={styles.chartBox}>
          <h3>Produtos Mais Vendidos (Top 5)</h3>
          <div style={{ width: '100%', height: 300, marginTop: '1rem', position: 'relative' }}>
            {montado && dadosProdutos.length > 0 && (
              <ResponsiveContainer width="99%" height="100%" minWidth={1} minHeight={1}>
                <BarChart data={dadosProdutos} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="nome" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={80} />
                  <Tooltip 
                    formatter={(value: any) => [`${value} unidades`, 'Vendas']}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="qtd" fill="#e31b23" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}