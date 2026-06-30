'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import styles from './perfil.module.css'; 
import { User } from 'lucide-react';
import { apiFetch } from '@/app/utils/api';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
}

interface Endereco {
  id: string;
  apelido: string; 
  bairro: string;
  rua?: string;
  logradouro?: string;
  numero: string;
}

export default function MinhaContaPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [carregando, setCarregando] = useState(true);
  
  const router = useRouter();

  useEffect(() => {
    const userString = localStorage.getItem('user'); 
    const token = localStorage.getItem('token'); 

    if (!userString || !token) {
      console.warn("Usuário não está logado ou token ausente.");
      setCarregando(false);
      return;
    }

    try {
      const userObj = JSON.parse(userString);
      const clienteId = userObj.id; 

      const buscarDadosDoPerfil = async () => {
        try {
          const resUsuario = await apiFetch(`/usuarios/${clienteId}`);
          if (resUsuario.ok) {
            setUsuario(await resUsuario.json());
          }

          const resEnderecos = await apiFetch(`/enderecos?cliente_id=${clienteId}`);
          if (resEnderecos.ok) {
            setEnderecos(await resEnderecos.json());
          }

        } catch (error) {
          console.error("Erro ao buscar dados do perfil:", error);
        } finally {
          setCarregando(false);
        }
      };

      buscarDadosDoPerfil();

    } catch (error) {
      console.error("Erro ao ler os dados do usuário no localStorage", error);
      setCarregando(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login'); 
  };

  if (carregando) {
    return <main className={styles.container}><p style={{ textAlign: 'center' }}>Carregando seus dados...</p></main>;
  }

  return (
    <main className={styles.container}>
      
      <div className={styles.header}>
        <div className={styles.avatarWrapper} style={{ marginBottom: '3px' }}>
          <User size={80} color="#1e1b4b" strokeWidth={1.5} />
        </div>
        <h1 className={styles.userName} style={{ margin: 0 }}>{usuario?.nome || 'Usuário'}</h1>
      </div>

      <section className={styles.card}>
        <span className={styles.label}>MINHA CONTA</span>
        
        <div className={styles.row}>
          <p><strong>Telefone:</strong> {usuario?.telefone || 'Não cadastrado'}</p>
        </div>
        
        <div className={styles.separator}></div>
        
        <div className={styles.row}>
          <p><strong>Email:</strong> {usuario?.email || 'Não cadastrado'}</p>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.addressHeader}>
           <span className={styles.label}>MEUS ENDEREÇOS</span>
           <button 
             className={styles.addAddressBtn} 
             onClick={() => router.push('/perfil/novo-endereco')}
           >
             + Novo
           </button>
        </div>

        {enderecos.length === 0 ? (
          <div className={styles.row}>
             <p style={{ color: '#64748b' }}>Nenhum endereço cadastrado ainda.</p>
          </div>
        ) : (
          enderecos.map((end, index) => (
            <div key={end.id}>
              <div 
                className={styles.row} 
                style={{ cursor: 'pointer' }}
                onClick={() => router.push(`/perfil/editar-endereco/${end.id}`)}
              >
                <p>
                  <strong>{end.rua || end.logradouro}, {end.numero}</strong>
                </p>
                <span style={{ color: '#1e1b4b', fontWeight: 'bold' }}>&gt;</span>
              </div>
              
              {index < enderecos.length - 1 && <div className={styles.separator}></div>}
            </div>
          ))
        )}
      </section>

      <button className={styles.logoutBtn} onClick={handleLogout}>
        Sair da conta
      </button>

    </main>
  );
}