import { Heart, Sparkles } from 'lucide-react';

/** Thank-you banner at the top of every shop page, asking shoppers to come back */
export function ComeBackBanner() {
  return (
    <aside aria-label='Lời nhắn từ shop' className='mb-6 animate-fade-up-slow'>
      {/* Animated gradient ring: the 2px padding shows the moving gradient around the inner card */}
      <div className='animate-gradient-shift rounded-3xl bg-[length:200%_auto] bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 p-[2px] shadow-emerald-500/20 shadow-lg'>
        <div className='relative isolate flex items-center gap-4 overflow-hidden rounded-[22px] bg-white/95 px-4 py-4 sm:px-6 dark:bg-slate-950/90'>
          <span
            className='-z-10 pointer-events-none absolute inset-y-0 left-0 w-1/2 animate-sweep bg-gradient-to-r from-transparent via-amber-200/60 to-transparent dark:via-amber-300/10'
            aria-hidden
          />

          <span className='relative flex h-12 w-12 shrink-0 items-center justify-center' aria-hidden>
            <span className='absolute inset-0 animate-pulse-ring rounded-full bg-rose-400/40' />
            <span className='relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30'>
              <Heart className='h-6 w-6 animate-heartbeat fill-current' />
            </span>
          </span>

          <div className='min-w-0 flex-1'>
            <p className='font-bold font-heading text-base text-foreground sm:text-lg'>
              Cảm ơn bạn đã chọn{' '}
              <span className='whitespace-nowrap bg-gradient-to-r from-emerald-700 via-teal-700 to-amber-700 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-amber-300'>
                Lion Shopping
              </span>
              !
            </p>
            <p className='mt-0.5 text-muted-foreground text-sm sm:text-base'>
              Nhớ ghé lại ủng hộ shop thường xuyên nhé. Mỗi tuần đều có hàng mới xinh xắn đang chờ bạn đó!
            </p>
          </div>

          <span className='hidden shrink-0 text-amber-500 sm:block dark:text-amber-300' aria-hidden>
            <Sparkles className='h-7 w-7 animate-float-slow' />
          </span>
        </div>
      </div>
    </aside>
  );
}
