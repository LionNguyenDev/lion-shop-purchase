import { BRAND, NAV_LINKS, SOCIALS } from '@/config/landing';
import { ROUTES } from '@/lib/routes';
import Link from 'next/link';
import { SOCIAL_ICONS } from './brand-icons';
import { LionMascot } from './lion-mascot';

const LINK =
  'rounded-md text-slate-600 transition-colors hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300';

export function LandingFooter() {
  return (
    <footer className='relative mt-8'>
      <span
        className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent'
        aria-hidden
      />
      <div className='mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr]'>
        <div className='sm:col-span-2 lg:col-span-1'>
          <div className='flex items-center gap-3'>
            <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 via-teal-50 to-amber-100 p-1.5 ring-1 ring-emerald-200 dark:from-emerald-500/20 dark:via-teal-500/10 dark:to-amber-500/20 dark:ring-emerald-500/30'>
              <LionMascot />
            </span>
            <span>
              <span className='block font-bold font-heading text-lg text-slate-900 dark:text-white'>{BRAND.name}</span>
              <span className='block text-slate-600 text-xs dark:text-slate-400'>{BRAND.tagline}</span>
            </span>
          </div>
        </div>

        <nav aria-labelledby='footer-explore'>
          <h2 id='footer-explore' className='font-semibold text-slate-900 dark:text-white'>
            Khám phá
          </h2>
          <ul className='mt-4 space-y-3 text-sm'>
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} className={LINK}>
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link href={ROUTES.SHOP} className={LINK}>
                Vào cửa hàng
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className='font-semibold text-slate-900 dark:text-white'>Mạng xã hội</h2>
          <ul className='mt-4 space-y-3 text-sm'>
            {SOCIALS.map((social) => {
              const Icon = SOCIAL_ICONS[social.platform];
              return (
                <li key={social.platform}>
                  <a
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={`${LINK} inline-flex items-center gap-2`}
                  >
                    <Icon className='h-4 w-4' />
                    {social.name}
                    <span className='text-slate-500 dark:text-slate-400'>{social.handle}</span>
                    <span className='sr-only'>(mở tab mới)</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className='border-slate-200 border-t dark:border-slate-800'>
        <div className='mx-auto flex max-w-6xl flex-col items-center gap-1.5 px-4 pt-5 pb-44 text-center text-slate-600 text-sm sm:flex-row sm:justify-between sm:px-6 sm:pb-6 sm:text-left dark:text-slate-400'>
          <p>
            © <span className='font-mono tabular-nums'>{new Date().getFullYear()}</span> {BRAND.name}.
          </p>
          <p>
            <span className='font-semibold text-slate-800 dark:text-slate-200'>{BRAND.techTeam}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
