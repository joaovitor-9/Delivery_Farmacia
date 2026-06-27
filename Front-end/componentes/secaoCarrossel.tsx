'use client'

import { useRef, useState, MouseEvent, UIEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false); 
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      carouselRef.current.style.scrollBehavior = 'smooth';
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    setIsMouseDown(true);
    setIsDragging(false);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setTimeout(() => setIsDragging(false), 50);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown || !carouselRef.current) return;
    e.preventDefault();
    
    setIsDragging(true); 
    
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; 
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    const carousel = carouselRef.current;

    const tamanhoUmBloco = carousel.scrollWidth / 4;

    if (carousel.scrollLeft >= tamanhoUmBloco * 2) {
      carousel.style.scrollBehavior = 'auto'; 
      carousel.scrollLeft -= tamanhoUmBloco;
    } 
    else if (carousel.scrollLeft <= 0) {
      carousel.style.scrollBehavior = 'auto';
      carousel.scrollLeft += tamanhoUmBloco; 
    }
  };

  if (produtos.length === 0) return null;

  const produtosDuplicados = [...produtos, ...produtos, ...produtos, ...produtos];

  return (
    <section className={styles.carouselWrapper}>
      <h2 className={styles.sectionTitle}>{titulo}</h2>
      
      <button 
        className={`${styles.arrow} ${styles.left}`} 
        onClick={() => scroll('left')}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <ChevronLeft size={24} color="currentColor" />
      </button>

      <button 
        className={`${styles.arrow} ${styles.right}`} 
        onClick={() => scroll('right')}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <ChevronRight size={24} color="currentColor" />
      </button>

      <div 
        className={styles.carousel} 
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onScroll={handleScroll}
        style={{ 
          cursor: isMouseDown ? 'grabbing' : 'grab',
          userSelect: 'none',
          scrollBehavior: isMouseDown ? 'auto' : 'smooth' 
        }}
      >
        {produtosDuplicados.map((p, index) => (
          <div 
            key={`${p.id}-${index}`} 
            onClickCapture={(e) => {
              if (isDragging) {
                e.stopPropagation(); 
                e.preventDefault();
              }
            }}
            style={{ 
              flexShrink: 0,
              height: '100%' 
            }}
          >
            <CardProduto 
              id={p.id} 
              nome={p.nome} 
              preco={p.preco} 
              imagem_url={p.imagem_url}
            />
          </div>
        ))}
      </div>
    </section>
  );
}