"use client"; 

import React from 'react';
import styles from './dashboard.module.css';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';


const dadosFaturamento = [
  { dia: 'Seg', valor: 320.50 },
  { dia: 'Ter', valor: 458.90 },
  { dia: 'Qua', valor: 280.00 },
  { dia: 'Qui', valor: 510.20 },
  { dia: 'Sex', valor: 650.00 },
  { dia: 'Sáb', valor: 890.30 },
  { dia: 'Dom', valor: 410.10 },
];

const dadosProdutos = [
  { nome: 'Dipirona', qtd: 145 },
  { nome: 'Dorflex', qtd: 112 },
  { nome: 'Vitamina C', qtd: 89 },
  { nome: 'Neosaldina', qtd: 76 },
  { nome: 'Ibuprofeno', qtd: 65 },
];

export default function DashboardPage() {
  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.pageTitle}>Visão Geral de Vendas</h1>
       
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <h3>Vendas Hoje</h3>
          <p className={styles.metricValue}>R$ 458,90</p>
        </div>
        <div className={styles.metricCard}>
          <h3>Pedidos Pendentes</h3>
          <p className={styles.metricValue}>14</p>
        </div>
        <div className={styles.metricCard}>
          <h3>Aguardando Separação</h3>
          <p className={styles.metricValue}>3</p>
        </div>
        <div className={styles.metricCard}>
          <h3>Entregas Concluídas</h3>
          <p className={styles.metricValue}>28</p>
        </div>
      </div>

      <div className={styles.chartsArea}>
        
        <div className={styles.chartBox}>
          <h3>Faturamento Semanal</h3>
          <div style={{ width: '100%', height: 300, marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
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
          </div>
        </div>

        <div className={styles.chartBox}>
          <h3>Produtos Mais Vendidos</h3>
          <div style={{ width: '100%', height: 300, marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
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
          </div>
        </div>

      </div>
    </div>
  );
}