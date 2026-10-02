import { Logo } from './logo';

export function SiteFooter() {
  return (
    <footer className='border-border/70 border-t bg-card'>
      <div className='mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-muted-foreground text-sm sm:flex-row sm:px-6'>
        <Logo />
        <p>© {new Date().getFullYear()} Lion Shopping. Giao hàng toàn quốc, thanh toán khi nhận hàng.</p>
      </div>
    </footer>
  );
}
