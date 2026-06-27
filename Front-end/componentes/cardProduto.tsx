'use function'
'use client'

import styles from '@/app/(cliente)/home.module.css'; 
import BotaoComprar from './botaoComprar';

interface CardProdutoProps {
  id: string;
  nome: string;
  preco: number;
  imagem_url?: string;
}

export default function CardProduto({ id, nome, preco, imagem_url }: CardProdutoProps) {
  const imagemPadrao = "https://placehold.co/300x300/f3f4f6/a1a1aa.png?text=Sem+Foto";

  return (
    <div className={styles.card}>
      <div 
        className={styles.imageArea} 
        style={{ padding: 0, overflow: 'hidden', height: '150px', backgroundColor: '#fff' }}
      >
        <img 
          src={imagem_url || imagemPadrao} 
          alt={`Foto do produto ${nome}`}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          draggable={false}
        />
      </div>
      
      <h3 className={styles.productName}>{nome}</h3>
      
      <p className={styles.price}>R$ {preco.toFixed(2).replace('.', ',')}</p>

      <BotaoComprar 
        produtoId={id} 
        nome={nome} 
        preco={preco} 
        imagem={imagem_url || imagemPadrao} 
      />
    </div>
  );
}