import { HeroActions } from '@/components/landing/hero-actions';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { BadgeCheck, KeyRound, MessageCircle, PackageCheck, ShoppingCart, Truck, UserPlus, Wallet } from 'lucide-react';
import { Suspense } from 'react';

const FEATURES = [
  { icon: BadgeCheck, title: 'Hàng chọn lọc', text: 'Mỗi sản phẩm đều được kiểm tra trước khi lên kệ.' },
  { icon: Truck, title: 'Giao toàn quốc', text: 'Giao đến 34 tỉnh thành theo địa chỉ hành chính mới.' },
  { icon: Wallet, title: 'Thanh toán khi nhận', text: 'Nhận hàng, kiểm tra rồi mới trả tiền.' },
  { icon: MessageCircle, title: 'Hỗ trợ qua Facebook', text: 'Liên hệ nhanh với shop qua Facebook của bạn.' },
];

const STEPS = [
  { icon: UserPlus, title: 'Tạo tài khoản', text: 'Đăng ký bằng email, số điện thoại và link Facebook.' },
  { icon: KeyRound, title: 'Nhập mật khẩu cửa hàng', text: 'Admin sẽ gửi mật khẩu để bạn vào khu mua sắm.' },
  { icon: ShoppingCart, title: 'Chọn hàng & đặt mua', text: 'Thêm vào giỏ, điền địa chỉ và chờ shop giao tới.' },
];

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader />
      <main className='flex-1'>
        <section className='mx-auto grid max-w-7xl items-center gap-12 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-20 lg:pb-24'>
          <div>
            <p className='mb-4 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 font-semibold text-primary-hover text-sm'>
              <PackageCheck className='h-4 w-4' aria-hidden />
              Cửa hàng dành riêng cho khách được mời
            </p>
            <h1 className='font-bold text-4xl leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl'>
              Mua sắm dễ dàng, <span className='text-primary'>giao tận nơi</span> cho bạn
            </h1>
            <p className='mt-5 max-w-xl text-lg text-muted-foreground leading-relaxed'>
              Lion Shopping tuyển chọn sản phẩm chất lượng với giá tốt. Đặt hàng trong vài bước, thanh toán khi nhận
              hàng.
            </p>
            <div className='mt-8'>
              <Suspense>
                <HeroActions />
              </Suspense>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4' aria-hidden>
            <div className='col-span-2 flex items-end justify-between rounded-2xl bg-primary p-6 text-primary-foreground shadow-lift'>
              <div>
                <p className='font-medium text-primary-foreground/80 text-sm'>Đặt hàng online</p>
                <p className='mt-1 font-bold font-heading text-3xl'>Giao hàng toàn quốc</p>
              </div>
              <Truck className='h-14 w-14 opacity-90' />
            </div>
            <div className='rounded-2xl bg-accent p-6 text-accent-foreground'>
              <ShoppingCart className='h-10 w-10' />
              <p className='mt-6 font-bold font-heading text-2xl'>3 bước</p>
              <p className='text-accent-foreground/85 text-sm'>là đặt xong đơn</p>
            </div>
            <div className='rounded-2xl border-2 border-primary bg-card p-6'>
              <Wallet className='h-10 w-10 text-primary' />
              <p className='mt-6 font-bold font-heading text-2xl'>COD</p>
              <p className='text-muted-foreground text-sm'>Nhận hàng mới trả tiền</p>
            </div>
          </div>
        </section>

        <section className='bg-card py-16 lg:py-20'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6'>
            <h2 className='font-bold text-3xl tracking-tight sm:text-4xl'>Vì sao chọn Lion Shopping?</h2>
            <div className='mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className='rounded-2xl border border-border bg-background p-6 transition-colors duration-200 hover:border-primary'
                >
                  <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground'>
                    <Icon className='h-6 w-6' aria-hidden />
                  </div>
                  <h3 className='mt-5 font-semibold text-lg'>{title}</h3>
                  <p className='mt-1.5 text-muted-foreground text-sm leading-relaxed'>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20'>
          <h2 className='font-bold text-3xl tracking-tight sm:text-4xl'>Bắt đầu mua sắm</h2>
          <ol className='mt-10 grid gap-4 md:grid-cols-3'>
            {STEPS.map(({ icon: Icon, title, text }, index) => (
              <li key={title} className='relative rounded-2xl bg-card p-6 shadow-card'>
                <span className='font-bold font-heading text-5xl text-primary-soft'>0{index + 1}</span>
                <div className='mt-2 flex items-center gap-3'>
                  <Icon className='h-6 w-6 text-accent' aria-hidden />
                  <h3 className='font-semibold text-lg'>{title}</h3>
                </div>
                <p className='mt-2 text-muted-foreground text-sm leading-relaxed'>{text}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
