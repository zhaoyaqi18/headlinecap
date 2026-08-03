import { useMemo, useState } from 'react'
import { STYLE_GUIDES, toTitleCase, type StyleGuide } from '@/lib/titlecase'
import { checkTitle, countErrors, type CheckedToken } from '@/lib/extras'
import { copyText, useCopyFeedback } from '@/lib/clipboard'

const SAMPLE = 'Walking through The Park with my Dog'

const STYLE_ACCENTS: Record<StyleGuide, string> = {
  ap: '#2563eb',
  apa: '#b91c1c',
  chicago: '#15803d',
  mla: '#7c3aed',
}

function GradedLine({ tokens }: { tokens: CheckedToken[] }) {
  return (
    <p className="font-display text-[15px] font-semibold leading-relaxed text-[#232120] sm:text-[19px]">
      {tokens.map((t, i) => {
        if (t.type === 'space') return <span key={i}>{t.text}</span>
        if (t.status === 'ok')
          return (
            <span key={i} className="text-[#15803d]">
              {t.text}
            </span>
          )
        return (
          <span
            key={i}
            title={`should be: ${t.expected}`}
            className="cursor-help text-[#b91c1c] underline decoration-wavy decoration-[#b91c1c]/60 underline-offset-4"
          >
            {t.text}
          </span>
        )
      })}
    </p>
  )
}

export default function CaseDetective() {
  const [input, setInput] = useState('')
  const [style, setStyle] = useState<StyleGuide>('apa')
  const [copied, trigger] = useCopyFeedback()

  const effective = input.trim() ? input : SAMPLE
  const tokens = useMemo(() => checkTitle(effective, style), [effective, style])
  const errors = useMemo(() => countErrors(tokens), [tokens])
  const wrongWords = tokens.filter((t) => t.status === 'wrong')

  const fixAll = async () => trigger(await copyText(toTitleCase(effective, style)))

  return (
    <section id="detective" className="mx-auto flex w-full max-w-4xl min-[1600px]:max-w-[1440px] flex-col pt-14">
      <div className="flex min-h-[116px] flex-col items-center justify-center text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#b91c1c]">Case Detective</p>
        <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-[#232120] sm:text-3xl">
          Already wrote it? Let us grade it.
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-[13px] leading-relaxed text-[#5c554a]">
          Paste a finished headline and pick a style guide — every word is checked,
          mistakes are marked in red ink with the correction right underneath.
        </p>
      </div>

      <div className="mt-6 flex flex-1 flex-col overflow-hidden rounded-3xl border border-[#e5ddcf] bg-[#fffdf8] shadow-[0_18px_50px_rgba(35,33,32,0.08)]">
        <div className="flex h-[40px] items-center justify-between gap-2 border-b border-[#ece4d4] bg-[#f7f1e5] px-3 sm:h-[52px] sm:px-7">
          <div className="flex flex-wrap gap-1.5">
            {STYLE_GUIDES.map((s) => (
              <button
                key={s.code}
                onClick={() => setStyle(s.code)}
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-all active:scale-95 sm:px-3 sm:py-1 sm:text-[12px] ${
                  style === s.code ? 'text-white' : 'border-[#ddd3c0] bg-white text-[#5c554a] hover:text-[#232120]'
                }`}
                style={style === s.code ? { background: STYLE_ACCENTS[s.code], borderColor: STYLE_ACCENTS[s.code] } : undefined}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-5 sm:p-7">
          <label className="block">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8a8071]">
              Your finished headline
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal ${
                errors === 0 ? 'bg-[#15803d]/10 text-[#15803d]' : 'bg-[#b91c1c]/10 text-[#b91c1c]'
              }`}>
                {errors === 0 ? '✓ All clear' : `${errors} word${errors > 1 ? 's' : ''} to fix`}
              </span>
            </span>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`paste your headline — e.g. ${SAMPLE}`}
              rows={2}
              maxLength={500}
              className="mt-2 w-full resize-y rounded-xl border border-[#ddd3c0] bg-white px-3 py-2.5 font-display text-[15px] font-semibold text-[#232120] outline-none transition-colors placeholder:font-normal placeholder:italic placeholder:text-[#b6ab97] focus:border-[#b91c1c]/60 sm:px-4 sm:py-3 sm:text-[19px] focus:shadow-[0_0_0_3px_rgba(185,28,28,0.08)]"
            />
          </label>
          {!input.trim() && (
            <p className="mt-2 text-[12px] text-[#a89e8d]">Grading a sample — paste your own headline to see it live.</p>
          )}

          <div className="mt-5 rounded-xl border border-[#f1ead9] bg-[#fbf8f1] px-5 pb-6 pt-4">
            <GradedLine tokens={tokens} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {errors > 0 && (
              <>
                <div className="flex flex-wrap gap-1.5">
                  {wrongWords.map((t, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-[#f1d4d4] bg-white px-2.5 py-1 text-[11px] font-medium text-[#5c554a]"
                    >
                      <span className="text-[#b91c1c] line-through decoration-[#b91c1c]/50">{t.text}</span>
                      <span className="mx-1 text-[#c9bfa9]">→</span>
                      <span className="font-semibold text-[#15803d]">{t.expected}</span>
                    </span>
                  ))}
                </div>
                <span className="grow" />
              </>
            )}
            <button
              onClick={fixAll}
              className={`rounded-full px-4 py-2 text-[12px] font-semibold transition-all active:scale-95 ${
                copied === 'ok'
                  ? 'bg-[#15803d] text-white'
                  : 'bg-[#232120] text-[#faf7f1] hover:-translate-y-0.5 hover:bg-[#b91c1c]'
              }`}
            >
              {copied === 'ok' ? '✓ Copied corrected title' : errors > 0 ? 'Fix all & copy' : 'Copy this title'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
