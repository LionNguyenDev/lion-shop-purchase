import { BackgroundBlobs } from '@/components/landing/background-blobs';
import { FloatingContact } from '@/components/landing/floating-contact';
import { HeroSection } from '@/components/landing/hero-section';
import { LandingFooter } from '@/components/landing/landing-footer';
import { LandingNavbar } from '@/components/landing/landing-navbar';
import { SocialSection } from '@/components/landing/social-section';

export default function Home() {
  return (
    <div
      data-landing
      className='relative isolate min-h-screen overflow-x-clip bg-white text-slate-900 dark:bg-slate-950 dark:text-white'
    >
      <BackgroundBlobs />
      <LandingNavbar />
      <main>
        <HeroSection />
        <SocialSection />
      </main>
      <LandingFooter />
      <FloatingContact />
    </div>
  );
}
