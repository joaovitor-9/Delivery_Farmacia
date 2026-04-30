'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './header.module.css';

export default function Header() {
  const pathname = usePathname();
  const isCleanPage = pathname === '/carrinho' || pathname === '/pedidos' || pathname === '/perfil' || pathname === '/login';

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        
        {!isCleanPage ? (
          <>
            <div className={styles.mainRow}>
              <div className={styles.logoWrapper}>
                <Link href="/">
                  <img src="/logo.png" alt="Farmácia De$contão" className={styles.logo} />
                </Link>
              </div>

              <div className={styles.searchContainer}>
                <input 
                  type="text" 
                  placeholder="O que você está procurando?" 
                  className={styles.searchInput} 
                />
                <button className={styles.searchBtn}>🔍</button>
              </div>

              <div className={styles.actions}>
                <Link href="/login" className={styles.userAction}>
                  <span>👤</span>
                  <div className={styles.userText}>
                    <strong>Entre ou Cadastre-se</strong>
                  </div>
                </Link>
                
                <Link href="/carrinho" className={styles.cartBtn}>
                  🛒 <span className={styles.cartBadge}>0</span>
                </Link>
              </div>
            </div>

            <nav className={styles.filterRow}>
              <button className={`${styles.pill} ${styles.active}`}>Todos</button>
              <button className={styles.pill}>Dor e Febre</button>
              <button className={styles.pill}>Gripe</button>
              <button className={styles.pill}>Infantil</button>
              <button className={styles.pill}>Higiene</button>
              <button className={styles.pill}>Ofertas</button>
            </nav>
          </>
        ) : (
          <div className={styles.checkoutHeader}>
            <Link href="/" className={styles.backLink}>
              <span className={styles.backArrow}>❮</span>
              <span className={styles.backText}>Continuar comprando</span>
            </Link>
            
            <div className={styles.logoCheckoutWrapper}>
              <Link href="/">
                <img src="/logo.png" alt="Farmácia De$contão" className={styles.logoClean} />
              </Link>
            </div>
            
            <div className={styles.emptyRightSpace}></div>
          </div>
        )}

      </div>
    </header>
  );
}