/** Three blurred colour blobs drifting slowly behind the whole page */
export function BackgroundBlobs() {
  return (
    <div className='-z-10 pointer-events-none fixed inset-0 overflow-hidden' aria-hidden>
      <div className='-top-40 -left-32 absolute h-[28rem] w-[28rem] transform-gpu animate-blob rounded-full bg-emerald-300/40 blur-3xl dark:bg-emerald-500/15' />
      <div className='-right-40 absolute top-1/3 h-[26rem] w-[26rem] transform-gpu animate-blob rounded-full bg-amber-300/40 blur-3xl [animation-delay:4s] dark:bg-amber-500/10' />
      <div className='-bottom-40 absolute left-1/4 h-[30rem] w-[30rem] transform-gpu animate-blob rounded-full bg-teal-300/35 blur-3xl [animation-delay:8s] dark:bg-teal-500/15' />
    </div>
  );
}
