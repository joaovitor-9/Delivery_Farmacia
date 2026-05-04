'use client'

import { User, ChevronRight, CreditCard, LogOut } from 'lucide-react';
import styles from './perfil.module.css';

export default function Perfil() {
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <div className={styles.avatarWrapper}>
          <User size={100} color="#1e1b4b" strokeWidth={2.5} />
        </div>
        <h1 className={styles.userName}>João Elias</h1>
      </div>

      <div className={styles.card}>
        <span className={styles.label}>MINHA CONTA</span>
        <div className={styles.row}>
          <p><strong>Telefone:</strong> (81) 9 9999-9999</p>
        </div>
        <div className={styles.separator}></div>
        <div className={styles.row}>
          <p><strong>Email:</strong> cliente@gmail.com</p>
        </div>
      </div>

      <div className={styles.card}>
        <span className={styles.label}>MEUS ENDEREÇOS</span>
        <div className={styles.row}>
          <p><strong>Casa (Centro)</strong></p>
          <ChevronRight size={20} color="#64748b" />
        </div>
        <div className={styles.separator}></div>
        <div className={styles.row}>
          <p><strong>Trabalho (Bairro Novo)</strong></p>
          <ChevronRight size={20} color="#64748b" />
        </div>
      </div>

      <div className={styles.card}>
        <span className={styles.label}>PAGAMENTO</span>
        <div className={styles.row}>
          <p><strong>Cartão de Crédito **** 1234</strong></p>
          <CreditCard size={20} color="#64748b" />
        </div>
        <div className={styles.separator}></div>
        <div className={styles.row}>
          <p><strong>Cartão de Débito **** 1010</strong></p>
          <CreditCard size={20} color="#64748b" />
        </div>
      </div>

      <button className={styles.logoutBtn} onClick={handleLogout}>
        <LogOut size={20} />
        Sair da Conta
      </button>
    </main>
  );
}