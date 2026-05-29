'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingCart, ReceiptText, User } from 'lucide-react';
import styles from './botaoNav.module.css';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <Link href="/" className={pathname === '/' ? styles.active : styles.link}>
        <Home size={26} />
      </Link>
      
      <Link href="/carrinho" className={pathname === '/carrinho' ? styles.active : styles.link}>
        <ShoppingCart size={26} />
      </Link>
      
      <Link href="/pedidos" className={pathname === '/pedidos' ? styles.active : styles.link}>
        <ReceiptText size={26} />
      </Link>
      
      <Link href="/perfil" className={pathname === '/perfil' ? styles.active : styles.link}>
        <User size={26} />
      </Link>
    </nav>
  );
}