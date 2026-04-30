import styles from './perfil.module.css';

export default function Perfil() {
  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <div className={styles.avatarIcon}>👤</div>
        <h1 className={styles.userName}>João Elias</h1>
      </div>

      <div className={styles.card}>
        <span className={styles.label}>MINHA CONTA</span>
        <div className={styles.row}>
          <p><strong>Telefone:</strong> (81) 9 9999-9999</p>
        </div>
        <div className={styles.separator}></div>
        <div className={styles.row}>
          <p><strong>Email:</strong> meuemail@gmail.com</p>
        </div>
      </div>

      <div className={styles.card}>
        <span className={styles.label}>MEUS ENDEREÇOS</span>
        <div className={styles.row}>
          <p><strong>Casa (Centro)</strong></p>
          <span>❯</span>
        </div>
        <div className={styles.separator}></div>
        <div className={styles.row}>
          <p><strong>Trabalho (Bairro Novo)</strong></p>
          <span>❯</span>
        </div>
      </div>

      <div className={styles.card}>
        <span className={styles.label}>PAGAMENTO</span>
        <div className={styles.row}>
          <p><strong>Cartão de Crédito **** 1234</strong></p>
          <span>💳</span>
        </div>
        <div className={styles.separator}></div>
        <div className={styles.row}>
          <p><strong>Cartão de Débito **** 1010</strong></p>
          <span>💳</span>
        </div>
      </div>

      <button className={styles.logoutBtn}>Sair da Conta</button>
    </main>
  );
}