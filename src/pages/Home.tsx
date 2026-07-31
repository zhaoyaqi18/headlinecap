import ConverterTool from '@/sections/ConverterTool'
import CaseDetective from '@/sections/CaseDetective'
import HeadlineAnalyzer from '@/sections/HeadlineAnalyzer'
import SlugGenerator from '@/sections/SlugGenerator'
import SeoContent from '@/sections/SeoContent'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#faf7f1]">
      {/* classic ruled composition paper */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* single red margin line, standard loose-leaf */}
        <div className="absolute bottom-0 left-9 top-0 w-[1.5px] bg-[#e29a9a]/55 sm:left-16" />
        {/* three binder holes, evenly spaced, left of the margin line */}
        {['22%', '50%', '78%'].map((top) => (
          <span
            key={top}
            className="absolute left-[18px] hidden h-[15px] w-[15px] rounded-full bg-[#faf7f1] shadow-[inset_1.5px_1.5px_3px_rgba(35,33,32,0.28),0_0_0_1px_rgba(35,33,32,0.05)] sm:left-[38px] sm:block"
            style={{ top }}
          />
        ))}
        {/* soft vignette so the paper feels lit, not flat */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 70% at 50% 0%, rgba(255,255,255,0.5), transparent 60%)',
          }}
        />
      </div>

      {/* header */}
      <header className="anim-fade-up relative mx-auto flex w-full max-w-4xl min-[1600px]:max-w-[1440px] items-center justify-between px-4 pt-6">
        <div className="flex items-center gap-2.5">
          <div className="font-display flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#232120] bg-white text-[15px] font-bold text-[#232120] shadow-[2px_2px_0_#232120]">
            Aa
          </div>
          <span className="font-display text-[16px] font-bold tracking-tight text-[#232120]">
            HeadlineCap
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://ko-fi.com/yugutou"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:from-orange-500 hover:to-orange-600 active:scale-95"
          >
            ☕ Tip
          </a>
          <a
            href="#converter"
            className="rounded-full bg-[#232120] px-4 py-2 text-xs font-semibold text-[#faf7f1] transition-all hover:-translate-y-0.5 hover:bg-[#b91c1c] active:scale-95"
          >
            Convert now
          </a>
          </div>
      </header>

      {/* hero */}
      <section className="relative mx-auto w-full max-w-4xl min-[1600px]:max-w-[1440px] px-4 pb-12 pt-14 text-center sm:pt-20">
        <div className="anim-fade-up mx-auto inline-flex items-center gap-2 rounded-full border border-[#e5ddcf] bg-white px-3.5 py-1.5 text-[11px] font-medium text-[#8a8071] [animation-delay:80ms]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#b91c1c]" />
          Free · No sign-up · AP / APA / Chicago / MLA side by side
        </div>

        <h1 className="anim-fade-up font-display mx-auto mt-7 max-w-4xl min-[1600px]:max-w-[1440px] text-[46px] font-bold leading-[1.08] tracking-tight text-[#232120] [animation-delay:160ms] sm:text-7xl lg:text-[92px]">
          Every headline,
          <br />
          <span className="italic text-[#b91c1c]">properly dressed.</span>
        </h1>

        <p className="anim-fade-up mx-auto mt-4 max-w-lg text-[13px] leading-relaxed text-[#5c554a] [animation-delay:220ms]">
          Paste a title — get all four style guides at once, each with one-click copy.
        </p>

        {/* typewriter accent line */}
        <p className="anim-fade-up mx-auto mt-5 max-w-md text-[11px] uppercase tracking-[0.25em] text-[#a89e8d] [animation-delay:240ms]">
          est. for writers · editors · students
          <span className="ink-caret ml-1 inline-block h-3 w-[2px] translate-y-0.5 bg-[#b91c1c]" />
        </p>
      </section>

      <div className="relative">
        <ConverterTool />
        <div className="mx-auto w-full max-w-4xl min-[1600px]:max-w-[1440px] px-4 lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-6">
          <CaseDetective />
          <HeadlineAnalyzer />
        </div>
        <SlugGenerator />
        <SeoContent />
      </div>
    </div>
  )
}
