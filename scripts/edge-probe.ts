// Edge-case probe — not part of the regression suite, a hostile-input sweep.
import { toTitleCase, toSentenceCase, explainTitleCase, convertLines } from '../src/lib/titlecase'
import { checkTitle, countErrors, analyzeHeadline, toSlug } from '../src/lib/extras'

const hostile = [
  '',
  '   ',
  '\n\n',
  'a',
  'I',                       // single uppercase pronoun
  'the',                     // only a minor word
  'hello\tworld   with\ttabs',  // irregular whitespace
  '"quoted title": a subtitle',
  'emoji 🚀 headline with flair',
  'trailing colon:',
  'double  spaces  everywhere',
  'mc donald’s farm',        // typographic apostrophe
  'x'.repeat(300),
  'résumé of the year',
  '50 shades of grey: the sequel',
  'and but or nor for so yet',  // all conjunctions, first/last forced
]

let crash = 0
for (const h of hostile) {
  try {
    for (const st of ['ap', 'apa', 'chicago', 'mla'] as const) {
      const conv = toTitleCase(h, st)
      // explain must always agree with convert
      const joined = explainTitleCase(h, st).map((t) => t.text).join('')
      if (joined !== conv) console.log(`DIVERGE [${st}] ${JSON.stringify(h)}: ${JSON.stringify(joined)} vs ${JSON.stringify(conv)}`)
      // detective: converted output must be clean
      const errs = countErrors(checkTitle(conv, st))
      if (errs !== 0) console.log(`DETECT-DIRTY [${st}] ${JSON.stringify(h)} -> ${JSON.stringify(conv)} errors=${errs}`)
    }
    toSentenceCase(h)
    convertLines(h, 'ap')
    analyzeHeadline(h)
    toSlug(h)
  } catch (e) {
    crash++
    console.log(`CRASH on ${JSON.stringify(h)}:`, (e as Error).message)
  }
}

// targeted spot checks
console.log('---')
console.log('tabs:', JSON.stringify(toTitleCase('hello\tworld with\ttabs', 'ap')))
console.log('quote:', JSON.stringify(toTitleCase('"quoted title": a subtitle', 'chicago')))
console.log('emoji:', JSON.stringify(toTitleCase('emoji 🚀 headline with flair', 'ap')))
console.log('mc:', JSON.stringify(toTitleCase('mc donald’s farm', 'mla')))
console.log('résumé:', JSON.stringify(toTitleCase('résumé of the year', 'ap')))
console.log('conj:', JSON.stringify(toTitleCase('and but or nor for so yet', 'ap')))
console.log('slug-emoji:', JSON.stringify(toSlug('emoji 🚀 headline!')))
console.log('slug-cjk:', JSON.stringify(toSlug('你好 world')))
console.log('analyzer-300:', JSON.stringify(analyzeHeadline('x '.repeat(150)).score))
console.log('detective-wrong:', JSON.stringify(checkTitle('The Art Of War', 'ap').filter(t => t.status === 'wrong')))
console.log(crash === 0 ? '\nPROBE CLEAN — no crashes, no divergence' : `\n${crash} CRASHES`)
