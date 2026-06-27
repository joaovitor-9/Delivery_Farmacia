'use client';

import toast from 'react-hot-toast';
import { Plus } from 'lucide-react'; 
import styles from './botaoComprar.module.css';

interface BotaoComprarProps {
  produtoId: string;
  nome: string;
  preco: number;
  imagem?: string; 
}

export default function BotaoComprar({ produtoId, nome, preco, imagem }: BotaoComprarProps) {
  
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
        quantidade: 1,
        imagem: imagem 
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
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '8px' 
      }}
    >
      <Plus size={20} color="currentColor" strokeWidth={2.5} />
    </button>
  );
}