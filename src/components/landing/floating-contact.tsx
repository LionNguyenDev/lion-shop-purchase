import { CONTACTS } from '@/config/landing';
import { cn } from '@/lib/utils';
import { MessengerIcon, ZaloIcon } from './brand-icons';

// Spec: FLOATING_CHAT_BUTTONS.md. Rows pop in 0.15s apart; the Messenger ping lags 0.7s so the rings never pulse together
const BUTTONS = [
  { href: CONTACTS.zalo, label: 'Nhắn Zalo', Icon: ZaloIcon, ping: 'bg-sky-400/40', pingDelay: '0s' },
  {
    href: CONTACTS.messenger,
    label: 'Nhắn Messenger',
    Icon: MessengerIcon,
    ping: 'bg-fuchsia-400/40',
    pingDelay: '0.7s',
  },
];

export function FloatingContact() {
  return (
    <div className='fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3'>
      {BUTTONS.map(({ href, label, Icon, ping, pingDelay }, i) => (
        <div
          key={href}
          className='group flex animate-chat-pop items-center gap-3 motion-reduce:animate-none'
          style={{ animationDelay: `${0.8 + i * 0.15}s` }}
        >
          <span
            className='pointer-events-none translate-x-2 select-none whitespace-nowrap rounded-full bg-slate-900 px-3 py-1.5 font-semibold text-white text-xs opacity-0 shadow-lg transition-[opacity,transform] duration-200 group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:translate-x-0 group-hover:opacity-100 dark:bg-white dark:text-slate-900'
            aria-hidden
          >
            {label}
          </span>
          <div className='relative'>
            <span
              className={cn('absolute inset-0 animate-ping rounded-full motion-reduce:animate-none', ping)}
              style={{ animationDelay: pingDelay }}
              aria-hidden
            />
            <a
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={label}
              className='hover:-rotate-12 relative flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white shadow-slate-900/15 shadow-xl transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 active:scale-95 dark:border-slate-700 dark:bg-slate-800'
            >
              <Icon className='h-8 w-8' />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
