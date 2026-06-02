'use client';

import toast from 'react-hot-toast';
import styles from './botaoComprar.module.css';

interface BotaoComprarProps {
  produtoId: string;
  nome: string;
  preco: number;
}

export default function BotaoComprar({ produtoId, nome, preco }: BotaoComprarProps) {
  
  const handleAdicionarAoCarrinho = () => {
    const carrinhoAtual = JSON.parse(localStorage.getItem('carrinho') || '[]');

    const indexItemExistente = carrinhoAtual.findIndex(
      (item: any) => item.produto_id === produtoId
    );

    if (indexItemExistente >= 0) {
      carrinhoAtual[indexItemExistente].quantidade += 1;
    } else {
      carrinhoAtual.push({
        produto_id: produtoId,
        nome: nome,
        preco: preco,
        quantidade: 1
      });
    }
    localStorage.setItem('carrinho', JSON.stringify(carrinhoAtual));
    
    window.dispatchEvent(new Event('carrinhoAtualizado'));
    
    toast.success('Item adicionado ao carrinho!');
  };

  return (
    <button 
      onClick={handleAdicionarAoCarrinho}
      className={styles.botao}
      title="Adicionar ao Carrinho"
    >
      +
    </button>
  );
}