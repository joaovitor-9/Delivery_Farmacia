import Header from '../../componentes/header';
import BottomNav from '../../componentes/botaoNav';

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: 'calc(100vh - 150px)', paddingTop: '20px' }}>
        {children}
      </main>
      <BottomNav />
    </>
  );
}