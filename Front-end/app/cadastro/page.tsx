'use client'

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './cadastro.module.css';

export default function CadastroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    telefone: '',
  });
  
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '[http://127.0.0.1:8000](http://127.0.0.1:8000)'}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao realizar o cadastro.");
      }

      router.push("/login");
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
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

        <form onSubmit={handleSubmit} className={styles.form}>
          {erro && <div className={styles.errorBox}>{erro}</div>}
          
          <div className={styles.inputGroup}>
            <label>Nome Completo</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
          </div>

          <div className={styles.inputGroup}>
            <label>E-mail</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className={styles.inputGroup}>
            <label>CPF</label>
            <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required />
          </div>

          <div className={styles.inputGroup}>
            <label>Telefone</label>
            <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} required />
          </div>

          <div className={styles.inputGroup}>
            <label>Senha</label>
            <input type="password" name="senha" value={formData.senha} onChange={handleChange} required />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <div className={styles.footer}>
          <Link href="/login" className={styles.backLink}>Já possui conta? Fazer login</Link>
          <Link href="/" className={styles.backLink}>← Voltar para a loja</Link>
        </div>
      </div>
    </main>
  );
}