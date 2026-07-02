'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import styles from './novoEndereco.module.css';
import { apiFetch } from '@/app/utils/api'; 

function NovoEnderecoConteudo() {
  const router = useRouter();
  const [clienteId, setClienteId] = useState<string>('');
  
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [complemento, setComplemento] = useState('');
  
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const userObj = JSON.parse(userString);
      setClienteId(userObj.id);
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    const novoEndereco = {
      cliente_id: clienteId,
      cep,
      logradouro: rua,
      numero,
      bairro,
      cidade,
      complemento
    };

    try {
      const response = await apiFetch('/enderecos', {
        method: 'POST',
        body: JSON.stringify(novoEndereco)
      });

      if (response.ok) {
        alert('Endereço salvo com sucesso!');
        router.push('/perfil');
      } else {
        alert('Erro ao salvar o endereço.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Falha na comunicação com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          ❮ Voltar
        </button>
        <h1 className={styles.title}>Novo Endereço</h1>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label>CEP</label>
          <input 
            type="text" 
            value={cep} 
            onChange={(e) => setCep(e.target.value)} 
            required 
          />
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup} style={{ flex: 3 }}>
            <label>Rua / Logradouro</label>
            <input 
              type="text" 
              value={rua} 
              onChange={(e) => setRua(e.target.value)} 
              required 
            />
          </div>
          <div className={styles.inputGroup} style={{ flex: 1, marginLeft: '10px' }}>
            <label>Número</label>
            <input 
              type="text" 
              value={numero} 
              onChange={(e) => setNumero(e.target.value)} 
              required 
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Bairro</label>
          <input 
            type="text" 
            value={bairro} 
            onChange={(e) => setBairro(e.target.value)} 
            required 
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Cidade</label>
          <input 
            type="text" 
            value={cidade} 
            onChange={(e) => setCidade(e.target.value)} 
            required 
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Complemento (Opcional)</label>
          <input 
            type="text" 
            value={complemento} 
            onChange={(e) => setComplemento(e.target.value)} 
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={carregando}>
          {carregando ? 'Salvando...' : 'Salvar Endereço'}
        </button>
      </form>
    </main>
  );
}

export default function NovoEnderecoPage() {
  return (
    <Suspense fallback={<div>Carregando formulário...</div>}>
      <NovoEnderecoConteudo />
    </Suspense>
  );
}