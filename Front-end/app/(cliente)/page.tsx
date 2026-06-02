'use client'

import { useRef, useState, useEffect } from 'react';
import styles from './home.module.css';

export default function Home() {
  const carouselRef = useRef<HTMLDivElement>(null);

  
  const [medicamentos, setMedicamentos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/produtos')
      .then(resposta => resposta.json())
      .then(dados => {
        setMedicamentos(dados); 
        setCarregando(false);
      })
      .catch(erro => {
        console.error("Erro ao buscar produtos:", erro);
        setCarregando(false);
      });
  }, []);

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
          {carregando ? (
            <p style={{ padding: '20px' }}>Carregando prateleiras...</p>
          ) : (
            medicamentos.map((m) => (
              <div key={m.id} className={styles.card}>
                <div className={styles.imageArea}>
                  <span style={{ fontSize: '40px' }}></span>
                </div>
                <h3 className={styles.productName}>{m.nome}</h3>
                
              
                <p className={styles.price}>R$ {m.preco.toFixed(2).replace('.', ',')}</p>
                
                <button className={styles.addBtnSquare}>+</button>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}