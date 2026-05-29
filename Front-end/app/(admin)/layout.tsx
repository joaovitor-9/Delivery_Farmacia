"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { UserRound, LogOut, Package, BarChart3 } from 'lucide-react';
import styles from './adminLayout.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        
        <div className={styles.logoContainer}>
          <Image 
            src="/logo.png" 
            alt="Logo Farmácia De$contão" 
            width={180} 
            height={70} 
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        <div className={styles.profileContainer}>
          <div className={styles.avatar}>
            <UserRound size={24} color="#ffffff" />
          </div>
          <div className={styles.profileInfo}>
            <p className={styles.profileName}>Olá, Admin</p>
            <p className={styles.profileRole}>Gerente de Loja</p>
          </div>
        </div>
        
        <nav className={styles.navMenu}>
          <Link 
            href="/pedidos-admin" 
            className={`${styles.navItem} ${pathname === '/pedidos-admin' ? styles.active : ''}`}
          >
            <Package size={20} /> Gestão de Pedidos
          </Link>
          
          <Link 
            href="/dashboard" 
            className={`${styles.navItem} ${pathname === '/dashboard' ? styles.active : ''}`}
          >
            <BarChart3 size={20} /> Dashboard de Vendas
          </Link>
        </nav>

        <div className={styles.footerMenu}>
          <Link href="/" className={styles.logoutLink}>
            <LogOut size={20} /> Sair do Sistema
          </Link>
        </div>

      </aside>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}