'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react'; 
import styles from './login.module.css';

export default function Login() {
  const router = useRouter();
  const [tipoLogin, setTipoLogin] = useState<'cliente' | 'funcionario'>('cliente');
  const [identificacao, setIdentificacao] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (tipoLogin === 'cliente') {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: identificacao, senha: senha }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Erro ao tentar fazer login.");
        }

        const data = await response.json();
        
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify({ 
          id: data.user?.id || "jwt-auth", 
          nome: data.user?.nome || "Usuário", 
          tipo: "cliente" 
        }));
        
        window.location.href = '/'; 

      } catch (err: any) {
        setErro(err.message);
      }
    } else {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '[http://127.0.0.1:8000](http://127.0.0.1:8000)'}/login/admin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario: identificacao, senha: senha }),
        });

        if (!response.ok) throw new Error("Usuário ou senha de admin incorretos.");

        const data = await response.json();
        
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify({ nome: 'Administrador', tipo: 'admin' }));
        
        window.location.href = '/pedidos-admin'; 
      } catch (err: any) {
        setErro(err.message);
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
            onClick={() => { setTipoLogin('cliente'); setErro(''); setIdentificacao(''); setSenha(''); setMostrarSenha(false); }}
          >
            Sou Cliente
          </button>
          <button 
            type="button"
            className={`${styles.toggleBtn} ${tipoLogin === 'funcionario' ? styles.active : ''}`}
            onClick={() => { setTipoLogin('funcionario'); setErro(''); setIdentificacao(''); setSenha(''); setMostrarSenha(false); }}
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
            <div className={styles.passwordContainer}>
              <input 
                type={mostrarSenha ? "text" : "password"} 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <button 
                type="button" 
                className={styles.eyeBtn}
                onClick={() => setMostrarSenha(!mostrarSenha)}
                title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <button type="submit" className={styles.submitBtn}>Entrar</button>
        </form>

        <div className={styles.footer}>
          {tipoLogin === 'cliente' && (
             <Link href="/cadastro" className={styles.backLink}>Não possui login? Criar conta</Link>
          )}
          <Link href="/" className={styles.backLink}>← Voltar para a loja</Link>
        </div>
      </div>
    </main>
  );
}