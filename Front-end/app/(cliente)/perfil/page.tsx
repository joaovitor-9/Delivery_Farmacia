'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import styles from './perfil.module.css'; 


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
  rua: string;
  numero: string;
}

export default function MinhaContaPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [carregando, setCarregando] = useState(true);
  
  const router = useRouter();

useEffect(() => {

    const userString = localStorage.getItem('user'); 

    if (!userString) {
      console.warn("Usuário não está logado.");
      setCarregando(false);
      return;
    }

    try {
      // 2. Converte o texto JSON em um objeto real do JavaScript
      const userObj = JSON.parse(userString);
      const clienteId = userObj.id; // 3. Pega o ID lá de dentro!

      const buscarDadosDoPerfil = async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

          // Busca os dados de contato do usuário
          const resUsuario = await fetch(`${apiUrl}/usuarios/${clienteId}`);
          if (resUsuario.ok) {
            setUsuario(await resUsuario.json());
          }

          // Busca a lista de endereços
          const resEnderecos = await fetch(`${apiUrl}/enderecos?cliente_id=${clienteId}`);
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
    router.push('/login'); 
  };

  if (carregando) {
    return <main className={styles.container}><p style={{ textAlign: 'center' }}>Carregando seus dados...</p></main>;
  }

  return (
    <main className={styles.container}>
      
      <div className={styles.header}>
        <div className={styles.avatarWrapper}>
          <span style={{ fontSize: '40px' }}>👤</span>
        </div>
        <h1 className={styles.userName}>{usuario?.nome || 'Usuário'}</h1>
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
        <span className={styles.label}>MEUS ENDEREÇOS</span>

        {enderecos.length === 0 ? (
          <div className={styles.row}>
             <p style={{ color: '#64748b' }}>Nenhum endereço cadastrado ainda.</p>
          </div>
        ) : (
          enderecos.map((end, index) => (
            <div key={end.id}>
              <div className={styles.row} style={{ cursor: 'pointer' }}>
                <p>
                  <strong>{end.apelido || 'Endereço'}</strong> ({end.bairro})
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