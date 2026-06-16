'use client'

import { useRef } from 'react';
import styles from '@/app/(cliente)/home.module.css';
import CardProduto from './cardProduto';

interface ProdutoInfo {
  id: string;
  nome: string;
  preco: number;
  imagem_url?: string;
}

interface SecaoCarrosselProps {
  titulo: string;
  produtos: ProdutoInfo[];
}

export default function SecaoCarrossel({ titulo, produtos }: SecaoCarrosselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (produtos.length === 0) return null;

  return (
    <section className={styles.carouselWrapper}>
      <h2 className={styles.sectionTitle}>{titulo}</h2>
      
      <button className={`${styles.arrow} ${styles.left}`} onClick={() => scroll('left')}>❮</button>
      <button className={`${styles.arrow} ${styles.right}`} onClick={() => scroll('right')}>❯</button>

      <div className={styles.carousel} ref={carouselRef}>
        {produtos.map((p) => (
          <CardProduto 
            key={p.id} 
            id={p.id} 
            nome={p.nome} 
            preco={p.preco} 
            imagem_url={p.imagem_url}
          />
        ))}
      </div>
    </section>
  );
}