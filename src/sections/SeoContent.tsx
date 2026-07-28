const COMPARE_ROWS = [
  { word: 'Articles (a, an, the)', ap: 'lowercase', apa: 'lowercase', chicago: 'lowercase', mla: 'lowercase' },
  { word: 'Coordinating conjunctions (and, but, or)', ap: 'lowercase', apa: 'lowercase', chicago: 'lowercase', mla: 'lowercase' },
  { word: 'Short prepositions (in, on, at, to)', ap: 'lowercase', apa: 'lowercase', chicago: 'lowercase', mla: 'lowercase' },
  { word: 'Long prepositions (with, through, into)', ap: 'CAPITALIZED', apa: 'CAPITALIZED', chicago: 'lowercase', mla: 'lowercase' },
  { word: 'First & last word', ap: 'capitalized', apa: 'capitalized', chicago: 'capitalized', mla: 'capitalized' },
  { word: 'Word after a colon', ap: 'capitalized', apa: 'capitalized', chicago: 'capitalized', mla: 'capitalized' },
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
    <div className="mx-auto w-full max-w-4xl px-4 pb-24">
      {/* style comparison table */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold tracking-tight text-[#232120]">
          One rule splits the four styles
        </h2>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[#5c554a]">
          Every style guide agrees on articles, conjunctions and short prepositions.
          The famous disagreement is over <i>long</i> prepositions — that is why the converter
          shows all four results instead of making you pick first.
        </p>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-[#e5ddcf] bg-white shadow-[0_1px_3px_rgba(35,33,32,0.06)]">
          <table className="w-full min-w-[560px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#ece4d4] bg-[#f7f1e5] text-[10px] uppercase tracking-wider text-[#8a8071]">
                <th className="px-4 py-3 font-bold">Word type</th>
                <th className="px-4 py-3 font-bold text-[#2563eb]">AP</th>
                <th className="px-4 py-3 font-bold text-[#b91c1c]">APA</th>
                <th className="px-4 py-3 font-bold text-[#15803d]">Chicago</th>
                <th className="px-4 py-3 font-bold text-[#7c3aed]">MLA</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((r, i) => (
                <tr key={r.word} className={`border-b border-[#f1ead9] last:border-0 ${i % 2 ? 'bg-[#fbf8f1]' : ''}`}>
                  <td className="px-4 py-3 font-medium text-[#232120]">{r.word}</td>
                  <td className={`px-4 py-3 ${r.ap === 'CAPITALIZED' ? 'font-bold text-[#2563eb]' : 'text-[#5c554a]'}`}>{r.ap}</td>
                  <td className={`px-4 py-3 ${r.apa === 'CAPITALIZED' ? 'font-bold text-[#b91c1c]' : 'text-[#5c554a]'}`}>{r.apa}</td>
                  <td className={`px-4 py-3 ${r.chicago === 'CAPITALIZED' ? 'font-bold text-[#15803d]' : 'text-[#5c554a]'}`}>{r.chicago}</td>
                  <td className={`px-4 py-3 ${r.mla === 'CAPITALIZED' ? 'font-bold text-[#7c3aed]' : 'text-[#5c554a]'}`}>{r.mla}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* worked example */}
      <section className="mt-14 rounded-2xl border border-[#e5ddcf] bg-white p-6 shadow-[0_1px_3px_rgba(35,33,32,0.06)]">
        <h2 className="font-display text-xl font-bold tracking-tight text-[#232120]">
          Watch one sentence become four headlines
        </h2>
        <p className="mt-1.5 text-[13px] text-[#8a8071]">input: <i>walking through the park with my dog</i></p>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {[
            { name: 'AP', out: 'Walking Through the Park With My Dog', color: '#2563eb' },
            { name: 'APA', out: 'Walking Through the Park With My Dog', color: '#b91c1c' },
            { name: 'Chicago', out: 'Walking through the Park with My Dog', color: '#15803d' },
            { name: 'MLA', out: 'Walking through the Park with My Dog', color: '#7c3aed' },
          ].map((r) => (
            <div key={r.name} className="rounded-xl border border-[#f1ead9] bg-[#fbf8f1] px-4 py-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: r.color }}>
                {r.name}
              </span>
              <p className="font-display mt-1 text-[16px] font-semibold text-[#232120]">{r.out}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold tracking-tight text-[#232120]">
          Questions, answered
        </h2>
        <div className="mt-5 space-y-2.5">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-[#e5ddcf] bg-white px-5 py-4 open:border-[#b91c1c]/30 open:shadow-[0_4px_18px_rgba(185,28,28,0.06)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between text-[14px] font-semibold text-[#232120] [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="ml-4 shrink-0 text-[#b91c1c] transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-[13px] leading-relaxed text-[#5c554a]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="mt-16 border-t border-[#e5ddcf] pt-6 text-center text-[12px] text-[#a89e8d]">
        HeadlineCap — free title case converter · no sign-up · runs 100% in your browser · AP / APA / Chicago / MLA
        <br className="sm:hidden" />
        {' '}<a href="https://tally.so/r/PdW5lx" target="_blank" rel="noopener" className="text-[#b91c1c] hover:underline">Feedback</a>
      </footer>
    </div>
  )
}
