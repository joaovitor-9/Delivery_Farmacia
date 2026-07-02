'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './editarEndereco.module.css';
import { apiFetch } from '@/app/utils/api'; 

export default function EditarEnderecoPage() {
  const router = useRouter();
  const params = useParams();
  const enderecoId = params.id as string;
  
  const [clienteId, setClienteId] = useState<string>('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [apelido, setApelido] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [complemento, setComplemento] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      router.push('/login');
      return;
    }

    const userObj = JSON.parse(userString);
    setClienteId(userObj.id);

    const buscarEndereco = async () => {
      try {
        const res = await apiFetch(`/enderecos?cliente_id=${userObj.id}`);
        
        if (res.ok) {
          const enderecos = await res.json();
          const enderecoAtual = enderecos.find((e: any) => String(e.id) === String(enderecoId));

          if (enderecoAtual) {
            setApelido(enderecoAtual.apelido || '');
            setCep(enderecoAtual.cep || '');
            setRua(enderecoAtual.rua || enderecoAtual.logradouro || '');
            setNumero(enderecoAtual.numero || '');
            setBairro(enderecoAtual.bairro || '');
            setCidade(enderecoAtual.cidade || '');
            setComplemento(enderecoAtual.complemento || '');
          } else {
            alert('Endereço não encontrado.');
            router.push('/perfil');
          }
        } else {
           console.error("Erro na requisição, não autorizado ou dados inválidos.");
        }
      } catch (error) {
        console.error('Erro ao buscar endereço:', error);
      } finally {
        setCarregando(false);
      }
    };

    buscarEndereco();
  }, [enderecoId, router]);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    const dadosAtualizados = {
      apelido,
      cep,
      logradouro: rua, 
      numero,
      bairro,
      cidade,
      complemento
    };

    try {
      const response = await apiFetch(`/enderecos/${enderecoId}?usuario_id=${clienteId}`, {
        method: 'PUT',
        body: JSON.stringify(dadosAtualizados),
      });

      if (response.ok) {
        alert('Endereço atualizado!');
        router.push('/perfil');
      } else {
        alert('Erro ao atualizar o endereço.');
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setSalvando(false);
    }
  };

  const handleDelete = async () => {
    const confirmar = window.confirm('Tem certeza que deseja excluir este endereço?');
    if (!confirmar) return;

    try {
      const response = await apiFetch(`/enderecos/${enderecoId}?usuario_id=${clienteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Endereço excluído!');
        router.push('/perfil');
      } else {
        alert('Erro ao excluir o endereço.');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  if (carregando) {
    return <main className={styles.container}><p style={{ textAlign: 'center' }}>Carregando endereço...</p></main>;
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={() => router.back()}>
          ❮ Voltar
        </button>
        <h1 className={styles.title}>Editar Endereço</h1>
      </div>

      <form className={styles.form} onSubmit={handleUpdate}>
        <div className={styles.inputGroup}>
          <label>CEP</label>
          <input type="text" value={cep} onChange={(e) => setCep(e.target.value)} required />
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup} style={{ flex: 3 }}>
            <label>Rua / Logradouro</label>
            <input type="text" value={rua} onChange={(e) => setRua(e.target.value)} required />
          </div>
          <div className={styles.inputGroup} style={{ flex: 1, marginLeft: '10px' }}>
            <label>Número</label>
            <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} required />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Bairro</label>
          <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} required />
        </div>

        <div className={styles.inputGroup}>
          <label>Cidade</label>
          <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} required />
        </div>

        <div className={styles.inputGroup}>
          <label>Complemento (Opcional)</label>
          <input type="text" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
        </div>

        <div className={styles.actionButtons}>
          <button type="submit" className={styles.submitBtn} disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar Alterações'}
          </button>
          
          <button type="button" className={styles.deleteBtn} onClick={handleDelete}>
            Excluir Endereço
          </button>
        </div>
      </form>
    </main>
  );
}