import { cn } from '@/lib/utils';

const round = (value: number) => Math.round(value * 100) / 100;

// Mane petals around the face, alternating two shades
const PETALS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i * Math.PI) / 6;
  return { cx: round(60 + Math.cos(angle) * 38), cy: round(62 + Math.sin(angle) * 38), dark: i % 2 === 0 };
});

/** Lion mascot, decorative only. Swap for the real logo SVG when available */
export function LionMascot({ className }: { className?: string }) {
  return (
    <svg viewBox='0 0 120 120' className={cn('h-full w-full', className)} aria-hidden focusable='false'>
      {PETALS.map((petal) => (
        <circle
          key={`${petal.cx}-${petal.cy}`}
          cx={petal.cx}
          cy={petal.cy}
          r='15'
          fill={petal.dark ? '#ea580c' : '#f59e0b'}
        />
      ))}
      <circle cx='60' cy='62' r='40' fill='#f59e0b' />
      <circle cx='40' cy='42' r='9' fill='#fbbf24' />
      <circle cx='80' cy='42' r='9' fill='#fbbf24' />
      <circle cx='40' cy='42' r='4.5' fill='#fb923c' />
      <circle cx='80' cy='42' r='4.5' fill='#fb923c' />
      <circle cx='60' cy='64' r='28' fill='#fde68a' />
      <ellipse cx='50' cy='60' rx='3.2' ry='4.2' fill='#1e293b' />
      <ellipse cx='70' cy='60' rx='3.2' ry='4.2' fill='#1e293b' />
      <circle cx='51.2' cy='58.4' r='1.1' fill='#fff' />
      <circle cx='71.2' cy='58.4' r='1.1' fill='#fff' />
      <circle cx='43' cy='71' r='4' fill='#fb7185' opacity='0.45' />
      <circle cx='77' cy='71' r='4' fill='#fb7185' opacity='0.45' />
      <ellipse cx='60' cy='75' rx='11' ry='8' fill='#fef3c7' />
      <path d='M55 69.5 Q60 66.5 65 69.5 Q62.5 74 60 74 Q57.5 74 55 69.5Z' fill='#7c2d12' />
      <path
        d='M60 74 v3 M60 77 q-3.5 3.5 -7 1 M60 77 q3.5 3.5 7 1'
        fill='none'
        stroke='#7c2d12'
        strokeWidth='1.8'
        strokeLinecap='round'
      />
    </svg>
  );
}
