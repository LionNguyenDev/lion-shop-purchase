import { HeroSection } from '@/components/landing/hero-section';
import { SocialSection } from '@/components/landing/social-section';
import { SiteShell } from '@/components/layout/site-shell';

export default function Home() {
  return (
    <SiteShell landing>
      <main className='flex-1'>
        <HeroSection />
        <SocialSection />
      </main>
    </SiteShell>
  );
}
