'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation'; 
import { Search, User, ChevronDown, ShoppingCart, UserCircle, Package, LogOut, ChevronLeft } from 'lucide-react';
import styles from './header.module.css';

function HeaderConteudo() {
  const [qtdCarrinho, setQtdCarrinho] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('');

  const [termoBusca, setTermoBusca] = useState('');
  
  const pathname = usePathname();
  const router = useRouter(); 
  const searchParams = useSearchParams();
  
  const isCheckout = pathname.startsWith('/carrinho');
  const isLayoutSimplificado = pathname.startsWith('/perfil') || pathname.startsWith('/pedidos');

  const filtroAtivo = searchParams.get('filtro') || 'Todos';

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

  const handleFiltro = (filtroSelecionado: string) => {
    if (filtroSelecionado === 'Todos') {
      router.push('/'); 
    } else {
      router.push(`/?filtro=${encodeURIComponent(filtroSelecionado)}`);
    }
  };

  const filtros = ['Todos', 'Genéricos', 'Dor e Febre', 'Gripe', 'Infantil', 'Higiene'];

  const renderActions = () => (
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
  );

  if (isCheckout) {
    return (
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.checkoutHeader}>
            <button 
              onClick={() => router.back()} 
              className={styles.backLink}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                cursor: 'pointer', 
                fontSize: '16px', 
                fontFamily: 'inherit', 
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <ChevronLeft size={20} color="#fff" />
              Voltar
            </button>
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

  if (isLayoutSimplificado) {
    return (
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.checkoutHeader}>
            <button 
              onClick={() => router.back()} 
              className={styles.backLink}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                cursor: 'pointer', 
                fontSize: '16px', 
                fontFamily: 'inherit', 
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px' 
              }}
            >
              <ChevronLeft size={20} color="#fff" />
              Voltar
            </button>
            <div className={styles.logoCheckoutWrapper}>
              <Link href="/">
                <img src="/logo.png" alt="Farmácia Descontão" className={styles.logoClean} />
              </Link>
            </div>
          </div>
          {renderActions()}
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

        {renderActions()}

        <div className={styles.filterRow}>
          {filtros.map((filtro) => (
            <button 
              key={filtro}
              className={`${styles.pill} ${filtroAtivo === filtro ? styles.active : ''}`}
              onClick={() => handleFiltro(filtro)}
            >
              {filtro}
            </button>
          ))}
        </div>

      </div>
    </header>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<div style={{ height: '80px', background: '#0f172a' }}>Carregando menu...</div>}>
      <HeaderConteudo />
    </Suspense>
  );
}