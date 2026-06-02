'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, User, ChevronDown, ShoppingCart, UserCircle, Package, LogOut } from 'lucide-react';
import styles from './header.module.css';

export default function Header() {
  const [qtdCarrinho, setQtdCarrinho] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('');

  const [termoBusca, setTermoBusca] = useState('');
  
  const pathname = usePathname();
  const router = useRouter(); 
  const isCheckout = pathname.startsWith('/carrinho');

  const atualizarContador = () => {
    const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
    const totalItens = carrinho.reduce((total: number, item: any) => total + item.quantidade, 0);
    setQtdCarrinho(totalItens);
  };

  useEffect(() => {
    atualizarContador();
    window.addEventListener('carrinhoAtualizado', atualizarContador);

    const usuarioSalvo = localStorage.getItem('user');

    if (usuarioSalvo) {
      setIsLoggedIn(true);
      try {
        const dadosUsuario = JSON.parse(usuarioSalvo);
        setNomeUsuario(dadosUsuario.nome || 'Usuário');
      } catch (error) {
        setNomeUsuario('Usuário');
      }
    } else {
      setIsLoggedIn(false);
    }

    return () => window.removeEventListener('carrinhoAtualizado', atualizarContador);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    setIsLoggedIn(false);
    setNomeUsuario('');
    setIsDropdownOpen(false);
    router.push('/login'); 
  };
  const handleBuscar = () => {
    if (termoBusca.trim() !== '') {
      router.push(`/?q=${encodeURIComponent(termoBusca)}`);
    } else {
      router.push('/');
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

  if (isCheckout) {
    return (
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.checkoutHeader}>
            <Link href="/" className={styles.backLink}>
              ❮ Continuar comprando
            </Link>
            <div className={styles.logoCheckoutWrapper}>
              <Link href="/">
                <img src="/logo.png" alt="Farmácia Descontão" className={styles.logoClean} />
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        
        <div className={styles.logoWrapper}>
          <Link href="/">
            <img src="/logo.png" alt="Farmácia Descontão" className={styles.logo} />
          </Link>
        </div>

        <div className={styles.mainRow}>
          <div className={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="O que você está procurando?" 
              className={styles.searchInput} 
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className={styles.searchBtn} onClick={handleBuscar}>
              <Search size={20} color="#94a3b8" />
            </button>
          </div>
        </div>

        <div className={styles.actions}>
          <div style={{ position: 'relative' }}>
            {isLoggedIn ? (
              <>
                <button 
                  className={styles.userActionAuth} 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <User size={24} color="#fff" />
                  <div className={styles.userText}>
                    <span>Olá,</span>
                    <strong>{nomeUsuario}</strong>
                  </div>
                  <ChevronDown size={16} color="#fff" />
                </button>

                {isDropdownOpen && (
                  <div className={styles.dropdown} onMouseLeave={() => setIsDropdownOpen(false)}>
                    <Link href="/perfil" className={styles.dropdownItem}>
                      <UserCircle size={18} />
                      Meu Perfil
                    </Link>
                    <Link href="/pedidos" className={styles.dropdownItem}>
                      <Package size={18} />
                      Meus Pedidos
                    </Link>
                    <div className={styles.divider}></div>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                      <LogOut size={18} />
                      Sair
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link href="/login" className={styles.userActionAuth} style={{ textDecoration: 'none' }}>
                <User size={24} color="#fff" />
                <div className={styles.userText}>
                  <span>Bem-vindo(a)</span>
                  <strong>Entrar ou Cadastrar</strong>
                </div>
              </Link>
            )}
          </div>

          <Link href="/carrinho" className={styles.cartBtn}>
            <ShoppingCart size={28} color="#fff" />
            {qtdCarrinho > 0 && (
              <span className={styles.cartBadge}>
                {qtdCarrinho}
              </span>
            )}
          </Link>
        </div>

        <div className={styles.filterRow}>
          <button className={`${styles.pill} ${styles.active}`}>Todos</button>
          <button className={styles.pill}>Dor e Febre</button>
          <button className={styles.pill}>Gripe</button>
          <button className={styles.pill}>Infantil</button>
          <button className={styles.pill}>Higiene</button>
          <button className={styles.pill}>Ofertas</button>
        </div>

      </div>
    </header>
  );
}