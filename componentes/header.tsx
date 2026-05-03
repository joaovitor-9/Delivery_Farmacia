'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User, ShoppingCart, ChevronDown, Package, UserCircle, LogOut } from 'lucide-react';
import styles from './header.module.css';

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ nome: string; tipo: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Recupera o usuário do localStorage ao carregar a página
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsMenuOpen(false);
    window.location.href = '/';
  };

  // Páginas que usam o cabeçalho "limpo" (sem busca/filtros)
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
                <input type="text" placeholder="O que você está procurando?" className={styles.searchInput} />
                <button className={styles.searchBtn}><Search size={20} color="#64748b" /></button>
              </div>

              <div className={styles.actions}>
                {!user ? (
                  /* ESTADO: ENTRE OU CADASTRE-SE */
                  <Link href="/login" className={styles.userAction}>
                    <User size={24} color="#ffffff" />
                    <div className={styles.userText}>
                      <strong>Entre ou Cadastre-se</strong>
                    </div>
                  </Link>
                ) : (
                  /* ESTADO: USUÁRIO LOGADO */
                  <div className={styles.userMenuContainer}>
                    <button className={styles.userActionAuth} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                      <User size={24} color="#ffffff" />
                      <div className={styles.userText}>
                        <span>Olá,</span>
                        <strong>{user.nome.split(' ')[0]}</strong>
                      </div>
                      <ChevronDown size={16} color="#ffffff" className={isMenuOpen ? styles.arrowOpen : ''} />
                    </button>

                    {isMenuOpen && (
                      <div className={styles.dropdown}>
                        <Link href="/perfil" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                          <UserCircle size={18} /> Meu Perfil
                        </Link>
                        <Link href="/pedidos" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                          <Package size={18} /> Meus Pedidos
                        </Link>
                        <div className={styles.divider} />
                        <button className={styles.logoutBtn} onClick={handleLogout}>
                          <LogOut size={18} /> Sair
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                <Link href="/carrinho" className={styles.cartBtn}>
                  <ShoppingCart size={26} color="#ffffff" />
                  <span className={styles.cartBadge}>0</span>
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
          /* CABEÇALHO DE CHECKOUT/PERFIL */
          <div className={styles.checkoutHeader}>
            <Link href="/" className={styles.backLink}>❮ Continuar comprando</Link>
            <div className={styles.logoCheckoutWrapper}>
              <img src="/logo.png" className={styles.logoClean} alt="Logo" />
            </div>
            <div style={{ flex: 1 }}></div>
          </div>
        )}
      </div>
    </header>
  );
}