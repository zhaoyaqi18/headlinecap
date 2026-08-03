import { useMemo, useState } from 'react'
import { analyzeHeadline } from '@/lib/extras'

const SAMPLE = 'The Ultimate Guide: 7 Proven Secrets'

function scoreColor(score: number): string {
  if (score >= 75) return '#15803d'
  if (score >= 50) return '#b45309'
  return '#b91c1c'
}

function scoreLabel(score: number): string {
  if (score >= 75) return 'Strong headline'
  if (score >= 50) return 'Decent — room to grow'
  return 'Needs work'
}

export default function HeadlineAnalyzer() {
  const [input, setInput] = useState('')
  const effective = input.trim() ? input : SAMPLE
  const report = useMemo(() => analyzeHeadline(effective), [effective])
  const color = scoreColor(report.score)

  const stats = [
    {
      label: 'Characters',
      value: String(report.charCount),
      hint: report.lengthStatus === 'ideal' ? '30–60 ✓' : report.lengthStatus === 'short' ? 'under 30' : 'over 60',
      ok: report.lengthStatus === 'ideal',
    },
    {
      label: 'Words',
      value: String(report.wordCount),
      hint: report.wordCount >= 5 && report.wordCount <= 9 ? '5–9 ✓' : 'aim 5–9',
      ok: report.wordCount >= 5 && report.wordCount <= 9,
    },
    {
      label: 'Power words',
      value: String(report.powerHits.length),
      hint: report.powerHits.length ? report.powerHits.slice(0, 3).join(', ') : 'none found',
      ok: report.powerHits.length > 0,
    },
    {
      label: 'Emotional words',
      value: String(report.emotionHits.length),
      hint: report.emotionHits.length ? report.emotionHits.slice(0, 3).join(', ') : 'none found',
      ok: report.emotionHits.length > 0,
    },
    {
      label: 'Number',
      value: report.hasNumber ? 'Yes' : 'No',
      hint: report.hasNumber ? '“7 Ways…” ✓' : 'numbers convert',
      ok: report.hasNumber,
    },
  ]

  return (
    <section id="analyzer" className="mx-auto flex w-full max-w-4xl min-[1600px]:max-w-[1440px] flex-col pt-14">
      <div className="flex min-h-[116px] flex-col items-center justify-center text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#b45309]">Headline Analyzer</p>
        <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-[#232120] sm:text-3xl">
          Will anyone actually click it?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-[13px] leading-relaxed text-[#5c554a]">
          A deterministic score from the things that move click-through: length, word count,
          power words, emotional words and numbers. Same headline, same score — every time.
        </p>
      </div>

      <div className="mt-6 flex flex-1 flex-col overflow-hidden rounded-3xl border border-[#e5ddcf] bg-[#fffdf8] shadow-[0_18px_50px_rgba(35,33,32,0.08)]">
        {/* top bar — same height as Case Detective for input alignment */}
        <div className="flex h-[52px] items-center justify-between border-b border-[#ece4d4] bg-[#f7f1e5] px-5 sm:px-7">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8a8071]">Score Report</span>
          <span className="text-[11px] text-[#a89e8d]">live scoring · deterministic</span>
        </div>
        <div className="flex-1 p-5 sm:p-7">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8a8071]">Headline to score</span>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`try me — e.g. ${SAMPLE}`}
              rows={2}
              maxLength={300}
              className="mt-2 w-full resize-y rounded-xl border border-[#ddd3c0] bg-white px-4 py-3 font-display text-[19px] font-semibold text-[#232120] outline-none transition-colors placeholder:font-normal placeholder:italic placeholder:text-[#b6ab97] focus:border-[#b45309]/60 focus:shadow-[0_0_0_3px_rgba(180,83,9,0.08)]"
            />
          </label>
          {!input.trim() && (
            <p className="mt-2 text-[12px] text-[#a89e8d]">Scoring a sample — type your own headline for a live score.</p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            {/* score card — same size as stat chips */}
            <div className="rounded-xl border border-[#f1ead9] bg-[#fbf8f1] px-2.5 py-2 sm:px-3.5 sm:py-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a8071]">Score</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#15803d]" />
              </div>
              <div className="font-display mt-1 text-[15px] font-bold sm:text-[20px]" style={{ color }}>
                {report.score}
              </div>
              <div className="truncate text-[10px] text-[#a89e8d]">
                {scoreLabel(report.score)}
              </div>
            </div>
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-[#f1ead9] bg-[#fbf8f1] px-2.5 py-2 sm:px-3.5 sm:py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a8071]">{s.label}</span>
                    <span className={`h-1.5 w-1.5 rounded-full ${s.ok ? 'bg-[#15803d]' : 'bg-[#d6cbb4]'}`} />
                  </div>
                  <div className="font-display mt-1 text-[15px] font-bold text-[#232120] sm:text-[20px]">{s.value}</div>
                  <div className="truncate text-[10px] text-[#a89e8d]" title={s.hint}>
                    {s.hint}
                  </div>
                </div>
              ))}

              {/* tips card spans the rest */}
              <div className="col-span-2 rounded-xl border border-[#f1d4d4] bg-[#fdf6f3] px-2.5 py-2 sm:col-span-3 sm:px-3.5 sm:py-2.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#b91c1c]">Editor's notes</span>
                <ul className="mt-1 space-y-1 text-[11px] leading-snug text-[#5c554a]">
                  {report.tips.slice(0, 3).map((t) => (
                    <li key={t} className="flex gap-1.5">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#b91c1c]" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
    </section>
  )
}
