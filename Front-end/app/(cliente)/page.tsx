'use client'

import { useRef } from 'react';
import styles from './home.module.css';

const MEDICAMENTOS = [
  { id: 1, nome: "Dipirona 500mg - 10 Comprimidos", preco: "R$ 9,90"},
  { id: 2, nome: "Dorflex 36 Comprimidos", preco: "R$ 22,50"},
  { id: 3, nome: "Neosaldina 20 Drágeas", preco: "R$ 29,90"},
  { id: 4, nome: "Vitamina C Cenevit 1g", preco: "R$ 18,90"},
  { id: 5, nome: "Ibuprofeno 600mg", preco: "R$ 15,00"},
];

export default function Home() {
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

  return (
    <main className={styles.container}>
      <section className={styles.carouselWrapper}>
        <h2 className={styles.sectionTitle}>Medicamentos</h2>
        
        <button className={`${styles.arrow} ${styles.left}`} onClick={() => scroll('left')}>❮</button>
        <button className={`${styles.arrow} ${styles.right}`} onClick={() => scroll('right')}>❯</button>

        <div className={styles.carousel} ref={carouselRef}>
          {MEDICAMENTOS.map((m) => (
            <div key={m.id} className={styles.card}>
              <div className={styles.imageArea}>
                <span style={{ fontSize: '40px' }}></span>
              </div>
              <h3 className={styles.productName}>{m.nome}</h3>
              <p className={styles.price}>{m.preco}</p>
              <button className={styles.addBtnSquare}>+</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}