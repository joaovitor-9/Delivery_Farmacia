'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';

const CLIENTES_MOCK = [
  { email: 'cliente@gmail.com', senha: '123', nome: 'João Elias' }
];

const FUNCIONARIOS_MOCK = [
  { usuario: 'admin', senha: '123', nome: 'Administrador' },
];

export default function Login() {
  const router = useRouter();
  const [tipoLogin, setTipoLogin] = useState<'cliente' | 'funcionario'>('cliente');
  const [identificacao, setIdentificacao] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (tipoLogin === 'cliente') {
      const user = CLIENTES_MOCK.find(c => c.email === identificacao && c.senha === senha);
      if (user) {
        localStorage.setItem('user', JSON.stringify({ nome: user.nome, tipo: 'cliente' }));
        // Navegação direta com recarregamento forçado
        window.location.href = '/'; 
      } else {
        setErro('E-mail ou senha incorretos.');
      }
    } else {
      const func = FUNCIONARIOS_MOCK.find(f => f.usuario === identificacao && f.senha === senha);
      if (func) {
        localStorage.setItem('user', JSON.stringify({ nome: func.nome, tipo: 'funcionario' }));
        // Navegação direta com recarregamento forçado para o painel
        window.location.href = '/dashboard'; 
      } else {
        setErro('Usuário ou senha incorretos.');
      }
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <Link href="/">
            <img src="/logo.png" alt="Farmácia De$contão" className={styles.logo} />
          </Link>
        </div>

        <div className={styles.toggleContainer}>
          <button 
            type="button"
            className={`${styles.toggleBtn} ${tipoLogin === 'cliente' ? styles.active : ''}`}
            onClick={() => { setTipoLogin('cliente'); setErro(''); setIdentificacao(''); setSenha(''); }}
          >
            Sou Cliente
          </button>
          <button 
            type="button"
            className={`${styles.toggleBtn} ${tipoLogin === 'funcionario' ? styles.active : ''}`}
            onClick={() => { setTipoLogin('funcionario'); setErro(''); setIdentificacao(''); setSenha(''); }}
          >
            Sou Funcionário
          </button>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          {erro && <div className={styles.errorBox}>{erro}</div>}
          <div className={styles.inputGroup}>
            <label>{tipoLogin === 'cliente' ? 'E-mail' : 'Usuário'}</label>
            <input 
              type={tipoLogin === 'cliente' ? 'email' : 'text'}
              value={identificacao}
              onChange={(e) => setIdentificacao(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Senha</label>
            <input 
              type="password" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitBtn}>Entrar</button>
        </form>

        <div className={styles.footer}>
          <Link href="/" className={styles.backLink}>← Voltar para a loja</Link>
        </div>
      </div>
    </main>
  );
}