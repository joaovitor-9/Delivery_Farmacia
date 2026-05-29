'use client'

import { Trash2 } from 'lucide-react';
import styles from './carrinho.module.css';

const ITENS_CARRINHO = [
  { id: 1, nome: "Dipirona 500mg - 10 Comprimidos", preco: 9.90},
  { id: 2, nome: "Dorflex 36 Comprimidos", preco: 22.50},
];

export default function Carrinho() {
  const subtotal = ITENS_CARRINHO.reduce((acc, item) => acc + item.preco, 0);
  const frete = 5.00;

  return (
    <main className={styles.container}>
      
      <div className={styles.stepper}>
        <div className={styles.stepActive}>
          <div className={styles.stepCircle}>1</div>
          <span>Carrinho</span>
        </div>
        <div className={styles.stepLine}></div>
        <div className={styles.step}>
          <div className={styles.stepCircle}>2</div>
          <span>Identificação</span>
        </div>
        <div className={styles.stepLine}></div>
        <div className={styles.step}>
          <div className={styles.stepCircle}>3</div>
          <span>Pagamento</span>
        </div>
      </div>

      <h1 className={styles.title}>Meu Carrinho</h1>

      <div className={styles.content}>

        <div className={styles.leftCol}>
          
          <section className={styles.productsList}>
            {ITENS_CARRINHO.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.imageArea}></div>
                <div className={styles.itemInfo}>
                  <h3 className={styles.itemName}>{item.nome}</h3>
                  <p className={styles.itemPrice}>R$ {item.preco.toFixed(2).replace('.', ',')}</p>
                </div>
                
                <div className={styles.qtyControl}>
                  <button className={styles.qtyBtn}>-</button>
                  <span className={styles.qtyNumber}>1</span>
                  <button className={styles.qtyBtn}>+</button>
                </div>

                <button className={styles.removeBtn}>
                  <Trash2 size={20} color="#94a3b8" strokeWidth={1.5} />
                </button>
              </div>
            ))}
          </section>

          <section className={styles.addressSection}>
            <h2 className={styles.sectionTitle}>Endereço de Entrega</h2>
            <div className={styles.formGrid}>
              <div className={`${styles.inputGroup} ${styles.cepField}`}>
                <label>CEP</label>
                <input type="text" placeholder="00000-000" />
              </div>
              <div className={styles.inputGroup}>
                <label>Rua / Logradouro</label>
                <input type="text" placeholder="Ex: Av. Sete de Setembro" />
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Número</label>
                  <input type="text" placeholder="123" />
                </div>
                <div className={styles.inputGroup}>
                  <label>Bairro</label>
                  <input type="text" placeholder="Ex: Centro" />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label>Complemento (Opcional)</label>
                <input type="text" placeholder="Ex: Bloco A, Apto 101" />
              </div>
            </div>
          </section>
        </div>
        
        <aside className={styles.summary}>
          <h2>Resumo do Pedido</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Frete</span>
            <span>R$ {frete.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Total</span>
            <span>R$ {(subtotal + frete).toFixed(2).replace('.', ',')}</span>
          </div>
          <button className={styles.checkoutBtn}>FINALIZAR COMPRA</button>
        </aside>
      </div>
    </main>
  );
}