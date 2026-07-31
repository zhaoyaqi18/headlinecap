import { useMemo, useRef, useState, type CSSProperties } from 'react'
import {
  STYLE_GUIDES,
  convertLines,
  explainTitleCase,
  toSentenceCase,
  toTitleCase,
  type ExplainedToken,
  type StyleGuide,
} from '@/lib/titlecase'

const SAMPLE = 'the quick brown fox jumps over the lazy dog'

const STYLE_ACCENTS: Record<StyleGuide, string> = {
  ap: '#2563eb',
  apa: '#b91c1c',
  chicago: '#15803d',
  mla: '#7c3aed',
}

const KIND_COLOR: Record<string, string> = {
  major: '#232120',
  minor: '#b0a58f',
  forced: '#b91c1c',
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}

function useCopyFeedback(): ['idle' | 'ok' | 'fail', (ok: boolean) => void] {
  const [state, setState] = useState<'idle' | 'ok' | 'fail'>('idle')
  const timer = useRef<number | null>(null)
  const trigger = (ok: boolean) => {
    setState(ok ? 'ok' : 'fail')
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), 1800)
  }
  return [state, trigger]
}

function ColoredLine({ tokens }: { tokens: ExplainedToken[] }) {
  return (
    <>
      {tokens.map((t, i) =>
        t.type === 'space' ? (
          <span key={i}>{t.text}</span>
        ) : (
          <span key={i} style={{ color: KIND_COLOR[t.kind ?? 'major'] }}>
            {t.text}
          </span>
        ),
      )}
    </>
  )
}

function StyleCard({
  style,
  name,
  usedBy,
  lines,
  explain,
}: {
  style: StyleGuide
  name: string
  usedBy: string
  lines: string[]
  explain: boolean
}) {
  const accent = STYLE_ACCENTS[style]
  const [state, trigger] = useCopyFeedback()
  const copyAll = () => copyText(lines.join('\n'))
  return (
    <button
      onClick={async () => trigger(await copyAll())}
      style={{ '--acc': accent } as CSSProperties}
      className="group relative flex flex-col gap-2 rounded-2xl border border-[#e5ddcf] bg-white p-4 text-left shadow-[0_1px_3px_rgba(35,33,32,0.06)] transition-all duration-200 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--acc)_45%,transparent)] hover:shadow-[0_14px_36px_color-mix(in_srgb,var(--acc)_18%,transparent)] active:scale-[0.98]"
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full transition-transform group-hover:scale-125" style={{ background: accent }} />
          <span className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: accent }}>
            {name}
          </span>
          <span className="rounded-full bg-[#f4efe5] px-2 py-0.5 text-[10px] font-medium text-[#8a8071]">
            {usedBy}
          </span>
        </div>
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors ${
            state === 'ok' ? 'bg-[#15803d]/10 text-[#15803d]' : 'bg-[#f4efe5] text-[#8a8071] group-hover:bg-[var(--acc)] group-hover:text-white'
          }`}
        >
          {state === 'ok' ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
          )}
        </span>
      </div>

      {state === 'ok' ? (
        <span className="font-display min-h-[32px] text-[19px] font-semibold text-[#15803d]">
          {lines.length > 1 ? `All ${lines.length} titles copied ✓` : 'Copied to clipboard ✓'}
        </span>
      ) : (
        <span className={`font-display block text-[#232120] ${lines.length > 1 ? 'max-h-44 space-y-2 overflow-y-auto pr-1 text-[15px]' : 'min-h-[32px] text-[19px] font-semibold leading-snug'}`}>
          {lines.map((line, i) =>
            explain ? (
              <span key={i} className="block font-semibold leading-relaxed">
                {lines.length > 1 && <span className="mr-1.5 text-[11px] text-[#c9bfa9]">{i + 1}.</span>}
                <ColoredLine tokens={explainTitleCase(line, style)} />
              </span>
            ) : (
              <span key={i} className="block font-semibold leading-relaxed">
                {lines.length > 1 && <span className="mr-1.5 text-[11px] text-[#c9bfa9]">{i + 1}.</span>}
                {line}
              </span>
            ),
          )}
        </span>
      )}
    </button>
  )
}

export default function ConverterTool() {
  const [input, setInput] = useState('')
  const [batch, setBatch] = useState(false)
  const [explain, setExplain] = useState(false)
  const [quickState, setQuickState] = useState<string | null>(null)
  const quickTimer = useRef<number | null>(null)

  const effective = input.trim() ? input : SAMPLE
  const inputLines = useMemo(
    () => (batch ? effective.split('\n').map((l) => l.trim()).filter(Boolean) : [effective.split('\n')[0].trim() || SAMPLE]),
    [effective, batch],
  )
  const results = useMemo(
    () =>
      STYLE_GUIDES.map((s) => ({
        ...s,
        lines: batch ? convertLines(effective, s.code) : [toTitleCase(inputLines[0], s.code)],
      })),
    [effective, batch, inputLines],
  )
  const sentence = useMemo(() => toSentenceCase(inputLines[0]), [inputLines])

  const quickCopy = async (label: string, text: string) => {
    if (await copyText(text)) {
      setQuickState(label)
      if (quickTimer.current) window.clearTimeout(quickTimer.current)
      quickTimer.current = window.setTimeout(() => setQuickState(null), 1800)
    }
  }

  const QUICK = [
    { label: 'Sentence case', text: sentence },
    { label: 'UPPERCASE', text: inputLines[0].toUpperCase() },
    { label: 'lowercase', text: inputLines[0].toLowerCase() },
  ]

  return (
    <section id="converter" className="anim-fade-up relative mx-auto w-full max-w-4xl min-[1600px]:max-w-[1440px] px-4 [animation-delay:280ms]">
      <div className="overflow-hidden rounded-3xl border border-[#e5ddcf] bg-[#fffdf8] shadow-[0_24px_70px_rgba(35,33,32,0.09)]">
        <div className="flex items-center justify-between border-b border-[#ece4d4] bg-[#f7f1e5] px-5 py-3 sm:px-7">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8a8071]">Manuscript Desk</span>
          <span className="text-[11px] text-[#a89e8d]">live preview · click any card to copy</span>
        </div>

        <div className="p-5 sm:p-7">
          {/* mode + explain toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-full border border-[#ddd3c0] bg-white p-0.5">
              {(['Single title', 'Batch mode'] as const).map((label, i) => {
                const active = batch === (i === 1)
                return (
                  <button
                    key={label}
                    onClick={() => setBatch(i === 1)}
                    className={`rounded-full px-3.5 py-1 text-[12px] font-semibold transition-all ${
                      active ? 'bg-[#232120] text-[#faf7f1]' : 'text-[#5c554a] hover:text-[#232120]'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setExplain((e) => !e)}
              className={`rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-all active:scale-95 ${
                explain
                  ? 'border-[#b91c1c] bg-[#b91c1c] text-white shadow-[0_2px_10px_rgba(185,28,28,0.25)]'
                  : 'border-[#ddd3c0] bg-white text-[#5c554a] hover:border-[#b91c1c]/50 hover:text-[#b91c1c]'
              }`}
            >
              ✏️ Explain the rules
            </button>
            {batch && (
              <span className="text-[11px] text-[#a89e8d]">one title per line — all four styles convert every line</span>
            )}
          </div>

          {/* input */}
          <label className="mt-4 block">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8a8071]">
              {batch ? 'Your headlines (one per line)' : 'Your headline'}
            </span>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={batch ? `paste a whole list — e.g.
${SAMPLE}
war and peace
a brief history of time` : `type or paste a headline — e.g. ${SAMPLE}`}
              rows={batch ? 5 : 3}
              maxLength={5000}
              className="mt-2 w-full resize-y rounded-xl border border-[#ddd3c0] bg-white px-4 py-3 font-display text-[19px] font-semibold text-[#232120] outline-none transition-colors placeholder:font-normal placeholder:italic placeholder:text-[#b6ab97] focus:border-[#b91c1c]/60 focus:shadow-[0_0_0_3px_rgba(185,28,28,0.08)]"
            />
          </label>
          {!input.trim() && (
            <p className="mt-2 text-[12px] text-[#a89e8d]">
              Showing a sample — start typing and all four styles update live.
            </p>
          )}

          {/* explain legend */}
          {explain && (
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-[#f1ead9] bg-[#fbf8f1] px-4 py-2.5 text-[11px] font-medium">
              <span className="text-[#8a8071]">Legend:</span>
              <span style={{ color: KIND_COLOR.major }}>■ major word — capitalized</span>
              <span style={{ color: KIND_COLOR.minor }}>■ minor word — lowercase here</span>
              <span style={{ color: KIND_COLOR.forced }}>■ first / last / after colon — always capitalized</span>
            </div>
          )}

          {/* four style cards */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {results.map((r) => (
              <StyleCard key={r.code} style={r.code} name={r.name} usedBy={r.usedBy} lines={r.lines} explain={explain} />
            ))}
          </div>

          {/* quick transforms */}
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#ece4d4] pt-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8a8071]">Quick transforms:</span>
            {QUICK.map((q) => (
              <button
                key={q.label}
                onClick={() => quickCopy(q.label, q.text)}
                className={`rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-all active:scale-95 ${
                  quickState === q.label
                    ? 'border-[#15803d] bg-[#15803d] text-white'
                    : 'border-[#ddd3c0] bg-white text-[#5c554a] hover:border-[#b91c1c]/50 hover:text-[#b91c1c]'
                }`}
                title={q.text}
              >
                {quickState === q.label ? '✓ Copied' : q.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
