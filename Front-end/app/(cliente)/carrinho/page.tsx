'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, ShoppingCart } from 'lucide-react';
import styles from './carrinho.module.css';
import { apiFetch } from '@/app/utils/api';

interface ItemCarrinho {
  produto_id: string;
  nome: string;
  preco: number;
  quantidade: number;
  imagem?: string; 
}

export default function Carrinho() {
  const router = useRouter();
  const [itensCarrinho, setItensCarrinho] = useState<ItemCarrinho[]>([]);
  const [carregando, setCarregando] = useState(true);
  
  const [enderecosSalvos, setEnderecosSalvos] = useState<any[]>([]);
  const [enderecoSelecionadoId, setEnderecoSelecionadoId] = useState<string>('novo');
  
  const [endereco, setEndereco] = useState({
    cep: '', logradouro: '', numero: '', bairro: '', cidade: '', complemento: ''
  });

  const [clienteId, setClienteId] = useState<string>('');

  useEffect(() => {
    const carrinhoSalvo = JSON.parse(localStorage.getItem('carrinho') || '[]');
    setItensCarrinho(carrinhoSalvo);

    const usuarioSalvo = localStorage.getItem('user');
    if (usuarioSalvo) {
      const usuario = JSON.parse(usuarioSalvo);
      setClienteId(usuario.id); 
      
      const buscarEnderecos = async () => {
        try {
          // Substituído para apiFetch
          const res = await apiFetch(`/enderecos?cliente_id=${usuario.id}`);
          if (res.ok) {
            const dados = await res.json();
            setEnderecosSalvos(dados);
      
            if (dados.length > 0) {
              setEnderecoSelecionadoId(dados[0].id);
            }
          }
        } catch (error) {
          console.error("Erro ao buscar endereços:", error);
        }
      };
      
      buscarEnderecos();
    }
    setCarregando(false);
  }, []);

  const subtotal = itensCarrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const frete = itensCarrinho.length > 0 ? 5.00 : 0;
  const total = subtotal + frete;

  const atualizarQuantidade = (produtoId: string, delta: number) => {
    const novoCarrinho = itensCarrinho.map(item => {
      if (item.produto_id === produtoId) {
        const novaQuantidade = item.quantidade + delta;
        return { ...item, quantidade: novaQuantidade > 0 ? novaQuantidade : 1 };
      }
      return item;
    });
    setItensCarrinho(novoCarrinho);
    localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
  };

  const removerItem = (produtoId: string) => {
    const novoCarrinho = itensCarrinho.filter(item => item.produto_id !== produtoId);
    setItensCarrinho(novoCarrinho);
    localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
  };

  const handleFinalizarCompra = async () => {
    if (!clienteId) {
      alert("Você precisa fazer login antes de finalizar a compra!");
      return;
    }
    if (itensCarrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    let idDoEnderecoParaOPedido = enderecoSelecionadoId;

    if (enderecoSelecionadoId === 'novo') {
      if (!endereco.cep || !endereco.logradouro || !endereco.numero || !endereco.cidade) {
        alert("Por favor, preencha os campos obrigatórios do endereço.");
        return;
      }

      try {
        const dadosEndereco = {
          cliente_id: clienteId, 
          cep: endereco.cep,
          logradouro: endereco.logradouro,
          numero: endereco.numero,
          bairro: endereco.bairro,
          cidade: endereco.cidade,
          complemento: endereco.complemento
        };

        const resEndereco = await apiFetch('/enderecos', {
          method: 'POST',
          body: JSON.stringify(dadosEndereco)
        });

        if (!resEndereco.ok) {
          const erroEnd = await resEndereco.json();
          alert("Erro no Endereço: " + JSON.stringify(erroEnd.detail || erroEnd));
          return; 
        }

        const respostaEnderecoBanco = await resEndereco.json();
        idDoEnderecoParaOPedido = respostaEnderecoBanco.id; 
      } catch (error) {
        console.error("Erro ao salvar endereço:", error);
        alert("Erro de conexão ao salvar endereço.");
        return;
      }
    }

    try {
      const dadosPedido = {
        cliente_id: clienteId, 
        endereco_id: idDoEnderecoParaOPedido, 
        itens: itensCarrinho.map(item => ({
          produto_id: item.produto_id,
          quantidade: item.quantidade
        }))
      };

      // Substituído para apiFetch
      const resPedido = await apiFetch('/pedidos', {
        method: 'POST',
        body: JSON.stringify(dadosPedido)
      });

      if (resPedido.ok) {
        alert("Pedido realizado com sucesso!");
        localStorage.removeItem('carrinho');
        setItensCarrinho([]);
        router.push('/');
      } else {
        const erroPedido = await resPedido.json();
        alert("Erro ao finalizar pedido: " + JSON.stringify(erroPedido.detail || erroPedido));
      }
    } catch (error) {
      console.error("Erro no fluxo de checkout:", error);
      alert("Erro de conexão ao finalizar pedido.");
    }
  };

  if (carregando) return <main className={styles.container}><h3>Carregando carrinho...</h3></main>;

  if (itensCarrinho.length === 0) {
    return (
      <main className={styles.container}>
        <div className={styles.stepper}>
          <div className={styles.stepActive}>
            <div className={styles.stepCircle}>1</div>
            <span>Carrinho</span>
          </div>
          <div className={styles.stepLine} style={{ backgroundColor: '#e2e8f0' }}></div>
          <div className={styles.step}>
            <div className={styles.stepCircle}>2</div>
            <span>Identificação</span>
          </div>
          <div className={styles.stepLine} style={{ backgroundColor: '#e2e8f0' }}></div>
          <div className={styles.step}>
            <div className={styles.stepCircle}>3</div>
            <span>Pagamento</span>
          </div>
        </div>

        <h1 className={styles.title}>Meu Carrinho</h1>
        
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}><ShoppingCart size={64} color="#94a3b8" strokeWidth={1.5} /></div>
          <h2 style={{ color: '#1e1b4b', marginBottom: '15px', fontSize: '24px' }}>
            Seu carrinho está vazio
          </h2>
          <p style={{ color: '#64748b', marginBottom: '30px' }}>
            Volte para a loja para adicionar produtos ao seu carrinho.
          </p>
          <button 
            onClick={() => router.push('/')}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            CONTINUAR COMPRANDO
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      
      <div className={styles.stepper}>
        <div className={styles.stepActive}>
          <div className={styles.stepCircle}>1</div>
          <span>Carrinho</span>
        </div>
        <div className={styles.stepLine}></div>
        <div className={styles.step}>
          <div className={styles.stepCircle}>2</div>
          <span>Identificação</span>
        </div>
        <div className={styles.stepLine}></div>
        <div className={styles.step}>
          <div className={styles.stepCircle}>3</div>
          <span>Pagamento</span>
        </div>
      </div>

      <h1 className={styles.title}>Meu Carrinho</h1>

      <div className={styles.content}>
        <div className={styles.leftCol}>
          
          <section className={styles.productsList}>
            {itensCarrinho.length === 0 ? (
              <p style={{ padding: '20px', color: '#64748b' }}>Seu carrinho está vazio.</p>
            ) : (
              itensCarrinho.map((item) => (
                <div key={item.produto_id} className={styles.cartItem}>
                  <div className={styles.imageArea}>
                    {item.imagem ? (
                      <img src={item.imagem} alt={item.nome} className={styles.itemFoto} />
                    ) : (
                      <span style={{ fontSize: '30px' }}>💊</span>
                    )}
                  </div>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemName}>{item.nome}</h3>
                    <p className={styles.itemPrice}>R$ {item.preco.toFixed(2).replace('.', ',')}</p>
                  </div>
                  
                  <div className={styles.qtyControl}>
                    <button 
                      className={styles.qtyBtn} 
                      onClick={() => atualizarQuantidade(item.produto_id, -1)}
                    >-</button>
                    <span className={styles.qtyNumber}>{item.quantidade}</span>
                    <button 
                      className={styles.qtyBtn} 
                      onClick={() => atualizarQuantidade(item.produto_id, 1)}
                    >+</button>
                  </div>

                  <button className={styles.removeBtn} onClick={() => removerItem(item.produto_id)}>
                    <Trash2 size={20} color="#94a3b8" strokeWidth={1.5} />
                  </button>
                </div>
              ))
            )}
          </section>

          <section className={styles.addressSection}>
            <h2 className={styles.sectionTitle}>Endereço de Entrega</h2>
         
            <div className={styles.inputGroup} style={{ marginBottom: '20px' }}>
              <label>Escolha onde deseja receber o pedido</label>
              <select 
                value={enderecoSelecionadoId}
                onChange={(e) => setEnderecoSelecionadoId(e.target.value)}
                style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #cbd5e1', 
                  backgroundColor: '#fff',
                  fontSize: '15px',
                  color: '#1e1b4b',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {enderecosSalvos.map(end => (
                  <option key={end.id} value={end.id}>
                    {end.apelido ? `(${end.apelido}) ` : ''}{end.rua || end.logradouro}, {end.numero} - {end.bairro}
                  </option>
                ))}
                <option value="novo">Cadastrar novo endereço</option>
              </select>
            </div>

            {enderecoSelecionadoId === 'novo' && (
              <div className={styles.formGrid}>
                <div className={`${styles.inputGroup} ${styles.cepField}`}>
                  <label>CEP</label>
                  <input 
                    type="text" 
                    placeholder="00000-000" 
                    value={endereco.cep}
                    onChange={(e) => setEndereco({...endereco, cep: e.target.value})}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Rua / Logradouro</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Av. Sete de Setembro" 
                    value={endereco.logradouro}
                    onChange={(e) => setEndereco({...endereco, logradouro: e.target.value})}
                  />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>Número</label>
                    <input 
                      type="text" 
                      placeholder="123" 
                      value={endereco.numero}
                      onChange={(e) => setEndereco({...endereco, numero: e.target.value})}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Bairro</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Centro"
                      value={endereco.bairro}
                      onChange={(e) => setEndereco({...endereco, bairro: e.target.value})}
                    />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label>Cidade</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Surubim"
                    value={endereco.cidade}
                    onChange={(e) => setEndereco({...endereco, cidade: e.target.value})}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Complemento (Opcional)</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Bloco A, Apto 101"
                    value={endereco.complemento}
                    onChange={(e) => setEndereco({...endereco, complemento: e.target.value})}
                  />
                </div>
              </div>
            )}
          </section>
        </div>
        
        <aside className={styles.summary}>
          <h2>Resumo do Pedido</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Frete</span>
            <span>R$ {frete.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Total</span>
            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
          <button 
            className={styles.checkoutBtn} 
            onClick={handleFinalizarCompra}
            disabled={itensCarrinho.length === 0}
            style={{ opacity: itensCarrinho.length === 0 ? 0.5 : 1 }}
          >
            FINALIZAR COMPRA
          </button>
        </aside>
      </div>
    </main>
  );
}