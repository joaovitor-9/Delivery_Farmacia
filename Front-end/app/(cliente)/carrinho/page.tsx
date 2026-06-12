'use client'

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import styles from './carrinho.module.css';

interface ItemCarrinho {
  produto_id: string;
  nome: string;
  preco: number;
  quantidade: number;
}

export default function Carrinho() {
  const [itensCarrinho, setItensCarrinho] = useState<ItemCarrinho[]>([]);
  const [carregando, setCarregando] = useState(true);
  
  const [endereco, setEndereco] = useState({
    cep: '', logradouro: '', numero: '', bairro: '', cidade: '', complemento: ''
  });

  // CORREÇÃO 1: Adicionamos o estado para guardar o ID do cliente
  const [clienteId, setClienteId] = useState<string>('');

  useEffect(() => {
    const carrinhoSalvo = JSON.parse(localStorage.getItem('carrinho') || '[]');
    setItensCarrinho(carrinhoSalvo);

    const usuarioSalvo = localStorage.getItem('user');
    if (usuarioSalvo) {
      const usuario = JSON.parse(usuarioSalvo);
      setClienteId(usuario.id); 
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
    // CORREÇÃO 2: Trava de segurança. Se não tiver ID (não logou), ele barra a compra!
    if (!clienteId) {
      alert("Você precisa fazer login antes de finalizar a compra!");
      return;
    }

    if (itensCarrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    if (!endereco.cep || !endereco.logradouro || !endereco.numero || !endereco.cidade) {
      alert("Por favor, preencha os campos obrigatórios do endereço (CEP, Rua, Número e Cidade).");
      return;
    }

    try {
      const dadosEndereco = {
        cliente_id: clienteId, // CORREÇÃO 3: Agora é automático!
        cep: endereco.cep,
        logradouro: endereco.logradouro,
        numero: endereco.numero,
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        complemento: endereco.complemento
      };

      const resEndereco = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enderecos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosEndereco)
      });

      if (!resEndereco.ok) {
        const erroEnd = await resEndereco.json();
        console.error("Erro ao salvar endereço:", erroEnd);
        alert("Erro no Endereço:\n" + JSON.stringify(erroEnd.detail || erroEnd));
        return; 
      }

      const respostaEnderecoBanco = await resEndereco.json();
      const idDoEnderecoReal = respostaEnderecoBanco.id; 

      const dadosPedido = {
        cliente_id: clienteId, // CORREÇÃO 3: Automático aqui também!
        endereco_id: idDoEnderecoReal, 
        itens: itensCarrinho.map(item => ({
          produto_id: item.produto_id,
          quantidade: item.quantidade
        }))
      };

      const resPedido = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosPedido)
      });

      if (resPedido.ok) {
        alert("Pedido realizado com sucesso!");
        localStorage.removeItem('carrinho');
        setItensCarrinho([]);
      } else {
        const erroPedido = await resPedido.json();
        console.error("Erro detalhado do Pedido:", erroPedido);
        alert("O Back-end recusou o pedido. Motivo:\n\n" + JSON.stringify(erroPedido.detail || erroPedido, null, 2));
      }
    } catch (error) {
      console.error("Erro no fluxo de checkout:", error);
      alert("Erro de conexão. Verifique se o back-end está rodando.");
    }
  };

  if (carregando) return <main className={styles.container}><h3>Carregando carrinho...</h3></main>;

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
                  <div className={styles.imageArea}></div>
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