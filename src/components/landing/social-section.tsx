import { SOCIALS, type SocialPlatform } from '@/config/landing';
import { cn } from '@/lib/utils';
import { Heart, MessageCircle, Music2, Share2 } from 'lucide-react';
import { SOCIAL_ICONS } from './brand-icons';
import { PhoneMockup } from './phone-mockup';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';
import { GLASS_CARD, SECTION } from './styles';

/** All button colours keep white text at 4.5:1 or more */
const PLATFORM_STYLES: Record<SocialPlatform, { glow: string; badge: string; button: string }> = {
  facebook: {
    glow: 'hover:shadow-blue-500/30',
    badge: 'bg-blue-600 text-white',
    button: 'bg-blue-600 text-white',
  },
  instagram: {
    glow: 'hover:shadow-pink-500/30',
    badge: 'bg-gradient-to-br from-purple-600 via-pink-700 to-orange-700 text-white',
    button: 'bg-gradient-to-r from-purple-600 via-pink-700 to-orange-700 text-white',
  },
  tiktok: {
    glow: 'hover:shadow-cyan-500/30',
    badge: 'bg-slate-950 text-white ring-2 ring-cyan-400/60 dark:bg-white dark:text-slate-950',
    button: 'bg-slate-950 text-white dark:bg-white dark:text-slate-950',
  },
  threads: {
    glow: 'hover:shadow-slate-500/30',
    badge: 'bg-slate-950 text-white dark:bg-white dark:text-slate-950',
    button: 'bg-slate-950 text-white dark:bg-white dark:text-slate-950',
  },
};

const line = 'rounded-full bg-slate-200 dark:bg-slate-700';

function FacebookScreen() {
  return (
    <div className='h-full bg-slate-100 dark:bg-slate-950'>
      <div className='bg-white px-3 pt-5 pb-2 font-bold text-blue-600 text-sm tracking-tight dark:bg-slate-900'>
        facebook
      </div>
      {[0, 1].map((post) => (
        <div key={post} className='mt-2 bg-white p-2.5 dark:bg-slate-900'>
          <div className='flex items-center gap-2'>
            <span className='h-5 w-5 rounded-full bg-gradient-to-br from-emerald-400 to-amber-300' />
            <span className={cn(line, 'h-1.5 w-14')} />
          </div>
          <span className={cn(line, 'mt-2 block h-1.5 w-full')} />
          <span className='mt-2 block h-12 rounded-md bg-gradient-to-br from-blue-100 to-teal-100 dark:from-blue-500/20 dark:to-teal-500/20' />
          <div className='mt-2 flex gap-3 text-slate-400'>
            <Heart className='h-3 w-3' />
            <MessageCircle className='h-3 w-3' />
          </div>
        </div>
      ))}
    </div>
  );
}

const IG_TILES = [
  'from-pink-200 to-orange-200',
  'from-emerald-200 to-teal-200',
  'from-amber-200 to-rose-200',
  'from-sky-200 to-indigo-200',
  'from-rose-200 to-fuchsia-200',
  'from-teal-200 to-lime-200',
  'from-orange-200 to-amber-100',
  'from-violet-200 to-pink-200',
  'from-emerald-100 to-sky-200',
];

function InstagramScreen() {
  return (
    <div className='h-full bg-white px-2.5 pt-5 dark:bg-slate-900'>
      <div className='flex items-center gap-2.5'>
        <span className='h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5'>
          <span className='block h-full w-full rounded-full border-2 border-white bg-amber-200 dark:border-slate-900' />
        </span>
        <div className='flex flex-1 justify-around'>
          {[0, 1, 2].map((stat) => (
            <span key={stat} className='flex flex-col items-center gap-1'>
              <span className={cn(line, 'h-1.5 w-4 bg-slate-300')} />
              <span className={cn(line, 'h-1 w-6')} />
            </span>
          ))}
        </div>
      </div>
      <span className={cn(line, 'mt-2.5 block h-1.5 w-20')} />
      <div className='mt-3 grid grid-cols-3 gap-0.5'>
        {IG_TILES.map((tile) => (
          <span key={tile} className={cn('aspect-square bg-gradient-to-br dark:opacity-60', tile)} />
        ))}
      </div>
    </div>
  );
}

function TikTokScreen() {
  return (
    <div className='relative h-full bg-gradient-to-b from-slate-800 via-slate-900 to-black'>
      <span className='absolute inset-x-6 top-12 h-24 rounded-full bg-gradient-to-br from-cyan-400/40 to-pink-500/40 blur-2xl' />
      <div className='absolute right-2 bottom-12 flex flex-col items-center gap-3 text-white'>
        <span className='h-7 w-7 rounded-full border-2 border-white bg-amber-200' />
        <Heart className='h-4 w-4 fill-current' />
        <MessageCircle className='h-4 w-4' />
        <Share2 className='h-4 w-4' />
      </div>
      <div className='absolute bottom-4 left-3 space-y-1.5'>
        <span className='block h-1.5 w-16 rounded-full bg-white/80' />
        <span className='block h-1.5 w-24 rounded-full bg-white/50' />
        <span className='flex items-center gap-1 text-white/80'>
          <Music2 className='h-3 w-3' />
          <span className='block h-1 w-14 rounded-full bg-white/40' />
        </span>
      </div>
    </div>
  );
}

function ThreadsScreen() {
  return (
    <div className='h-full bg-white px-3 pt-6 dark:bg-slate-900'>
      {[0, 1, 2].map((post) => (
        <div key={post} className='flex gap-2 pb-3'>
          <div className='flex flex-col items-center'>
            <span className='h-5 w-5 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-500' />
            <span className='mt-1 w-px flex-1 bg-slate-200 dark:bg-slate-700' />
          </div>
          <div className='flex-1 space-y-1.5 pt-0.5'>
            <span className={cn(line, 'block h-1.5 w-12 bg-slate-300')} />
            <span className={cn(line, 'block h-1.5 w-full')} />
            <span className={cn(line, 'block h-1.5 w-3/4')} />
          </div>
        </div>
      ))}
    </div>
  );
}

const SCREENS: Record<SocialPlatform, () => React.JSX.Element> = {
  facebook: FacebookScreen,
  instagram: InstagramScreen,
  tiktok: TikTokScreen,
  threads: ThreadsScreen,
};

export function SocialSection() {
  return (
    <section id='contact' aria-labelledby='contact-title' className={SECTION}>
      <Reveal>
        <SectionHeading
          id='contact-title'
          eyebrow='Follow us'
          title='Kết nối với Lion'
          description='Theo dõi shop để xem hàng mới, livestream và chương trình ưu đãi mỗi tuần.'
          icon={Share2}
        />
      </Reveal>

      <ul className='mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3'>
        {SOCIALS.map((social, i) => {
          const styles = PLATFORM_STYLES[social.platform];
          const Icon = SOCIAL_ICONS[social.platform];
          const Screen = SCREENS[social.platform];
          return (
            <li key={social.platform}>
              <Reveal delay={i * 100} className='h-full'>
                <article
                  className={cn(
                    GLASS_CARD,
                    'hover:-translate-y-1 flex h-full flex-col p-5 transition-[transform,box-shadow] duration-300 hover:shadow-2xl',
                    styles.glow
                  )}
                >
                  <PhoneMockup size='sm' className='h-56 w-full max-w-[9.5rem]'>
                    <Screen />
                  </PhoneMockup>

                  <div className='mt-5 mb-5 flex items-center gap-3'>
                    <span
                      className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', styles.badge)}
                    >
                      <Icon className='h-5 w-5' />
                    </span>
                    <div className='min-w-0'>
                      <h3 className='font-bold text-slate-900 dark:text-white'>{social.name}</h3>
                      <p className='truncate text-slate-600 text-sm dark:text-slate-400'>{social.handle}</p>
                    </div>
                  </div>
                  {social.followers && (
                    <p className='-mt-2 mb-5 text-slate-600 text-sm dark:text-slate-300'>
                      <span className='font-bold font-mono text-slate-900 tabular-nums dark:text-white'>
                        {social.followers}
                      </span>{' '}
                      người theo dõi
                    </p>
                  )}

                  <a
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={cn(
                      'btn-shimmer hover:-translate-y-0.5 mt-auto inline-flex h-11 items-center justify-center rounded-2xl px-4 font-semibold text-sm transition-transform duration-200',
                      styles.button
                    )}
                  >
                    Theo dõi {social.name}
                    <span className='sr-only'> (mở tab mới)</span>
                  </a>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
