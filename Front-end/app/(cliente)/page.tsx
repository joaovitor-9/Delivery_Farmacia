'use client'

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './home.module.css'; 
import SecaoCarrossel from '@/componentes/secaoCarrossel';

export default function Home() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get('q')?.toLowerCase() || '';
  
  const filtroAtual = searchParams.get('filtro') || 'Todos';

  useEffect(() => {
    fetch('http://127.0.0.1:8000/produtos')
      .then(resposta => resposta.json())
      .then(dados => {
        setProdutos(dados); 
        setCarregando(false);
      })
      .catch(erro => {
        console.error("Erro ao buscar produtos:", erro);
        setCarregando(false);
      });
  }, []);

  
  let produtosExibidos = produtos;

  if (query) {
    produtosExibidos = produtosExibidos.filter((p) => p.nome.toLowerCase().includes(query));
  }

 if (filtroAtual !== 'Todos') {
  produtosExibidos = produtosExibidos.filter(p => p.subcategoria === filtroAtual);
}

  const medicamentos = produtosExibidos.filter(p => p.categoria === 'Medicamento' || p.categoria === 'Medicamentos');
  const perfumaria = produtosExibidos.filter(p => p.categoria === 'Perfumaria');
  const suplementos = produtosExibidos.filter(p => p.categoria === 'Suplemento' || p.categoria === 'Suplementos');

  return (
    <main className={styles.container}>
      {carregando ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#fff' }}>
          <h3>Carregando prateleiras...</h3>
        </div>
      ) : (query || filtroAtual !== 'Todos') ? (
        <SecaoCarrossel 
          titulo={produtosExibidos.length > 0 ? `Resultados para "${query || filtroAtual}"` : `Nenhum produto encontrado`} 
          produtos={produtosExibidos} 
        />
      ) : (
        <>
          <SecaoCarrossel titulo="Medicamentos" produtos={medicamentos} />
          <SecaoCarrossel titulo="Perfumaria" produtos={perfumaria} />
          <SecaoCarrossel titulo="Suplementos" produtos={suplementos} />
        </>
      )}
    </main>
  );
}