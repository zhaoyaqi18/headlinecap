const COMPARE_ROWS = [
  { word: 'Articles (a, an, the)', ap: 'lowercase', apa: 'lowercase', chicago: 'lowercase', mla: 'lowercase' },
  { word: 'Coordinating conjunctions (and, but, or)', ap: 'lowercase', apa: 'lowercase', chicago: 'lowercase', mla: 'lowercase' },
  { word: 'Short prepositions (in, on, at, to)', ap: 'lowercase', apa: 'lowercase', chicago: 'lowercase', mla: 'lowercase' },
  { word: 'Long prepositions (with, through, into)', ap: 'CAPITALIZED', apa: 'CAPITALIZED', chicago: 'lowercase', mla: 'lowercase' },
  { word: 'Subordinating conjunctions (because, although, since)', ap: 'CAPITALIZED', apa: 'CAPITALIZED', chicago: 'CAPITALIZED', mla: 'CAPITALIZED' },
  { word: 'Verbs (is, are, was, have)', ap: 'CAPITALIZED', apa: 'CAPITALIZED', chicago: 'CAPITALIZED', mla: 'CAPITALIZED' },
  { word: 'First & last word', ap: 'capitalized', apa: 'capitalized', chicago: 'capitalized', mla: 'capitalized' },
  { word: 'Word after a colon', ap: 'capitalized', apa: 'capitalized', chicago: 'capitalized', mla: 'capitalized' },
]

const STYLE_GUIDE_CARDS = [
  { name: 'AP', color: '#2563eb', usedBy: 'News & journalism — wire services, newspapers, broadcast scripts.' },
  { name: 'APA', color: '#b91c1c', usedBy: 'Academic papers in the social sciences — psychology, education, business.' },
  { name: 'Chicago', color: '#15803d', usedBy: 'Books & general publishing — novels, nonfiction, magazines. The safest default.' },
  { name: 'MLA', color: '#7c3aed', usedBy: 'Humanities essays — literature, languages, cultural studies.' },
]

const FAQS = [
  {
    q: 'What is title case?',
    a: 'Title case capitalizes the major words of a headline (nouns, verbs, adjectives, adverbs) while keeping minor words (articles, short prepositions, coordinating conjunctions) lowercase. The first and last words are always capitalized, no matter what they are.',
  },
  {
    q: 'Which style guide should I use?',
    a: 'AP for news and journalism, APA for academic papers (social sciences), Chicago for books and general publishing, MLA for humanities essays. If no one told you which to use, Chicago is the safest default.',
  },
  {
    q: 'What is the real difference between the four styles?',
    a: 'They agree on almost everything except long prepositions. AP and APA capitalize prepositions of four or more letters ("Walking Through the Park"), while Chicago and MLA lowercase every preposition ("Walking through the Park"). That single rule is why this converter shows all four side by side.',
  },
  {
    q: 'Why is the word after a colon capitalized?',
    a: 'All four style guides treat the subtitle after a colon as a fresh start, so its first word is always capitalized — even articles: The Fellowship: A New Hope.',
  },
  {
    q: 'How are hyphenated words handled?',
    a: 'Each part of a hyphenated compound is checked against the minor-word rules: major parts capitalize, minor parts stay lowercase — Mother-in-Law, State-of-the-Art. The first part of the compound is always capitalized.',
  },
  {
    q: 'Does it preserve acronyms like NASA or FBI?',
    a: 'Yes — in normal mixed-case text, all-caps acronyms and camelCase brands (NASA, iPhone) are kept exactly as typed. Text pasted in ALL CAPS is treated as shouting and fully normalized by the style rules.',
  },
  {
    q: 'Can I convert many headlines at once?',
    a: 'Yes — switch to Batch mode and paste one headline per line. Every line is converted instantly under all four styles, and one click copies the whole result list, ready to paste into a spreadsheet or CMS.',
  },
  {
    q: 'What does “Explain the rules” do?',
    a: 'It color-codes every word of the output: ink for major words that are always capitalized, grey for minor words kept lowercase, and red for words forced uppercase by position (first word, last word, after a colon). It is the fastest way to actually learn the rule behind each result — something a chatbot answer never shows you.',
  },
  {
    q: 'Can it check a headline I already wrote?',
    a: 'Yes — the Case Detective grades your finished headline word by word against AP, APA, Chicago or MLA. Correctly styled words show in green, mistakes get a red-pen underline with the fix listed below, and one click copies the fully corrected title.',
  },
  {
    q: 'What is the Headline Analyzer score based on?',
    a: 'Five deterministic signals: character count (the 30–60 character SEO comfort zone), word count (5–9 words perform best), power words (free, proven, ultimate…), emotional words (amazing, shocking…), and whether the headline contains a number. No AI guessing — the same headline always gets the same score.',
  },
]

export default function SeoContent() {
  return (
    <div className="mx-auto w-full max-w-4xl min-[1600px]:max-w-[1440px] px-4 pb-24">
      {/* style comparison + quick reference */}
      <section className="mt-6 sm:mt-16">
        <div className="lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-6">
          {/* left column */}
          <div className="flex flex-col">
            <h3 className="font-display text-center text-2xl font-bold tracking-tight text-[#232120] sm:text-3xl">
              One rule splits the four styles
            </h3>
            <p className="mt-1.5 min-h-[58px] text-center text-[12px] leading-relaxed text-[#5c554a]">
              Every style guide agrees on articles, conjunctions and short prepositions.
              The famous disagreement is over <i>long</i> prepositions — that is why the converter
              shows all four results instead of making you pick first.
            </p>
            <div className="mt-2 flex-1 overflow-x-auto rounded-2xl border border-[#e5ddcf] bg-white shadow-[0_1px_3px_rgba(35,33,32,0.06)]">
              <table className="w-full min-w-[560px] text-left text-[10px] sm:text-[13px]">
                <thead>
                  <tr className="border-b border-[#ece4d4] bg-[#f7f1e5] text-[10px] uppercase tracking-wider text-[#8a8071]">
                    <th className="px-3 py-1 sm:px-4 sm:py-3.5 font-bold">Word type</th>
                    <th className="px-3 py-1 sm:px-4 sm:py-3.5 font-bold text-[#2563eb]">AP</th>
                    <th className="px-3 py-1 sm:px-4 sm:py-3.5 font-bold text-[#b91c1c]">APA</th>
                    <th className="px-3 py-1 sm:px-4 sm:py-3.5 font-bold text-[#15803d]">Chicago</th>
                    <th className="px-3 py-1 sm:px-4 sm:py-3.5 font-bold text-[#7c3aed]">MLA</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((r, i) => (
                    <tr key={r.word} className={`border-b border-[#f1ead9] last:border-0 ${i % 2 ? 'bg-[#fbf8f1]' : ''}`}>
                      <td className="px-3 py-1 sm:px-4 sm:py-3 font-medium text-[#232120]">{r.word}</td>
                      <td className={`px-3 py-1 sm:px-4 sm:py-3 ${r.ap === 'CAPITALIZED' ? 'font-bold text-[#2563eb]' : 'text-[#5c554a]'}`}>{r.ap}</td>
                      <td className={`px-3 py-1 sm:px-4 sm:py-3 ${r.apa === 'CAPITALIZED' ? 'font-bold text-[#b91c1c]' : 'text-[#5c554a]'}`}>{r.apa}</td>
                      <td className={`px-3 py-1 sm:px-4 sm:py-3 ${r.chicago === 'CAPITALIZED' ? 'font-bold text-[#15803d]' : 'text-[#5c554a]'}`}>{r.chicago}</td>
                      <td className={`px-3 py-1 sm:px-4 sm:py-3 ${r.mla === 'CAPITALIZED' ? 'font-bold text-[#7c3aed]' : 'text-[#5c554a]'}`}>{r.mla}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* right column */}
          <div className="mt-5 flex flex-col lg:mt-0">
            <h3 className="font-display text-center text-2xl font-bold tracking-tight text-[#232120] sm:text-3xl">
              Which style should you use?
            </h3>
            <p className="mx-auto mt-1.5 min-h-[58px] max-w-xs text-center text-[12px] leading-relaxed text-[#5c554a]">
              Pick the guide that matches your writing — news, academia, publishing or essays.
            </p>
            <div className="mt-3 flex flex-1 flex-col overflow-hidden rounded-2xl border border-[#e5ddcf] bg-white shadow-[0_1px_3px_rgba(35,33,32,0.06)]">
              <div className="flex items-center justify-between border-b border-[#ece4d4] bg-[#f7f1e5] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#8a8071]">
                <span>Style guide</span>
                <span>Best for</span>
              </div>
              <div className="flex flex-1 items-center justify-between gap-3 border-b border-[#f1ead9] bg-[#fbf8f1] px-4 py-3">
                <span className="text-[12px] font-medium text-[#232120]">Golden rule</span>
                <span className="text-right text-[12px] leading-snug text-[#b91c1c]">
                  First &amp; last word always capitalized
                </span>
              </div>
              {STYLE_GUIDE_CARDS.map((s, i) => (
                <div
                  key={s.name}
                  className={`flex flex-1 items-center justify-between gap-3 border-b border-[#f1ead9] px-4 py-3 last:border-0 ${i % 2 ? 'bg-[#fbf8f1]' : ''}`}
                >
                  <span className="shrink-0 text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: s.color }}>
                    {s.name}
                  </span>
                  <span className="text-right text-[12px] leading-snug text-[#5c554a]">{s.usedBy}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-6 sm:mt-14">
        <h2 className="font-display text-center text-2xl font-bold tracking-tight text-[#232120]">
          Questions, answered
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-2.5">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-[#e5ddcf] bg-white px-3 py-2.5 open:border-[#b91c1c]/30 open:shadow-[0_4px_18px_rgba(185,28,28,0.06)] sm:px-5 sm:py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-semibold leading-snug text-[#232120] [&::-webkit-details-marker]:hidden sm:text-[14px] sm:leading-normal">
                {f.q}
                <span className="ml-2 shrink-0 text-[#b91c1c] transition-transform duration-200 group-open:rotate-45 sm:ml-4">+</span>
              </summary>
              <p className="mt-1.5 text-[10px] leading-relaxed text-[#5c554a] sm:mt-3 sm:text-[13px]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* more free tools — site matrix */}
      <section className="mt-6 sm:mt-16">
        <h2 className="font-display text-center text-2xl font-bold tracking-tight text-[#232120]">
          More free tools you might need
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            {
              name: 'PDF Slim',
              color: '#2563eb',
              href: 'https://pdfslim.app/?utm_source=headlinecap&utm_medium=matrix&utm_campaign=site-banner',
              desc: 'Compress any PDF to an exact target size — 100% local, no upload, no sign-up.',
              formats: '50KB–5MB targets, merge, split & more',
            },
            {
              name: 'CompressIO',
              color: '#15803d',
              href: 'https://compressio.cc/?utm_source=headlinecap&utm_medium=matrix&utm_campaign=site-banner',
              desc: 'Compress, convert, crop & resize images right in your browser — no upload, no sign-up.',
              formats: 'JPG, PNG, WebP, HEIC, AVIF, SVG & more',
            },
            {
              name: 'HideChar',
              color: '#7c3aed',
              href: 'https://hidechar.com/?utm_source=headlinecap&utm_medium=matrix&utm_campaign=site-banner',
              desc: 'Turn any sentence into invisible text — encode secret messages that look blank but survive copy & paste.',
              formats: 'PUBG, Free Fire, Roblox, Discord & IG bios',
            },
          ].map((t) => (
            <a
              key={t.name}
              href={t.href}
              target="_blank"
              rel="sponsored noopener"
              className="group rounded-2xl border border-[#e5ddcf] bg-white p-5 shadow-[0_1px_3px_rgba(35,33,32,0.06)] transition-all hover:-translate-y-0.5 hover:border-[#b91c1c]/40 hover:shadow-[0_4px_18px_rgba(185,28,28,0.08)]"
            >
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold" style={{ color: t.color }}>
                  {t.name}
                </span>
                <span className="rounded-full bg-[#b91c1c]/10 px-2 py-0.5 text-[10px] font-semibold text-[#b91c1c]">
                  ✓ 100% FREE
                </span>
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#5c554a]">{t.desc}</p>
              <p className="mt-1 text-[11px] text-[#a89e8d]">{t.formats}</p>
            </a>
          ))}
        </div>
      </section>

      <footer className="mt-16 border-t border-[#e5ddcf] pt-6 text-center text-[12px] text-[#a89e8d]">
        <p className="mb-1.5">
          More free tools:{' '}
          <a href="https://pdfslim.app/?utm_source=headlinecap&utm_medium=matrix&utm_campaign=footer" target="_blank" rel="sponsored noopener" className="text-[#b91c1c] hover:underline">PDF Slim</a>
          {' · '}
          <a href="https://compressio.cc/?utm_source=headlinecap&utm_medium=matrix&utm_campaign=footer" target="_blank" rel="sponsored noopener" className="text-[#b91c1c] hover:underline">CompressIO</a>
          {' · '}
          <a href="https://hidechar.com/?utm_source=headlinecap&utm_medium=matrix&utm_campaign=footer" target="_blank" rel="sponsored noopener" className="text-[#b91c1c] hover:underline">HideChar</a>
        </p>
        HeadlineCap — free title case converter · no sign-up · runs 100% in your browser · AP / APA / Chicago / MLA
        <br className="sm:hidden" />
        {' '}<a href="https://tally.so/r/PdW5lx" target="_blank" rel="noopener" className="text-[#b91c1c] hover:underline">Feedback</a>
      </footer>
    </div>
  )
}
