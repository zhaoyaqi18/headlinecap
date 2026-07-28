import { useMemo, useState } from 'react'
import { toSlug } from '@/lib/extras'
import { copyText, useCopyFeedback } from '@/lib/clipboard'

const SAMPLE = 'State-of-the-Art Guide: 10 Tips & Tricks!'

export default function SlugGenerator() {
  const [input, setInput] = useState('')
  const [copied, trigger] = useCopyFeedback()
  const effective = input.trim() ? input : SAMPLE
  const slug = useMemo(() => toSlug(effective), [effective])

  return (
    <section id="slug" className="mx-auto w-full max-w-4xl px-4 pt-14">
      <div className="overflow-hidden rounded-3xl border border-[#e5ddcf] bg-[#fffdf8] shadow-[0_18px_50px_rgba(35,33,32,0.08)]">
        <div className="grid items-center gap-4 p-5 sm:grid-cols-[1fr_auto_1fr] sm:p-7">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8a8071]">
              URL Slug Generator
            </span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`title in — e.g. ${SAMPLE}`}
              maxLength={300}
              className="mt-2 w-full rounded-xl border border-[#ddd3c0] bg-white px-4 py-3 text-[15px] font-semibold text-[#232120] outline-none transition-colors placeholder:font-normal placeholder:italic placeholder:text-[#b6ab97] focus:border-[#15803d]/60 focus:shadow-[0_0_0_3px_rgba(21,128,61,0.08)]"
            />
          </label>

          <span className="hidden text-[22px] text-[#c9bfa9] sm:block">→</span>

          <button
            onClick={async () => trigger(await copyText(slug))}
            className="group rounded-xl border border-dashed border-[#c9bfa9] bg-[#fbf8f1] px-4 py-3 text-left transition-all hover:border-[#15803d]/60 hover:bg-[#15803d]/5 active:scale-[0.98]"
          >
            <span className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a8071]">
              yoursite.com/blog/
              <span className={copied === 'ok' ? 'text-[#15803d]' : 'text-[#a89e8d] group-hover:text-[#15803d]'}>
                {copied === 'ok' ? '✓ copied' : 'click to copy'}
              </span>
            </span>
            <span className="mt-1 block break-all font-mono text-[15px] font-semibold text-[#15803d]">
              {slug || '…'}
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
