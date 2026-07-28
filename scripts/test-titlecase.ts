/**
 * Accuracy tests for the title case engine (AP / APA / Chicago / MLA).
 * Run: npx tsx scripts/test-titlecase.ts
 */
import { toTitleCase, toSentenceCase, isMinorWord, type StyleGuide } from '../src/lib/titlecase'

let passed = 0
let failed = 0

function eq(actual: unknown, expected: unknown, label: string) {
  const ok = actual === expected
  if (ok) passed++
  else {
    failed++
    console.error(`✗ FAIL ${label}\n  expected: ${JSON.stringify(expected)}\n  actual:   ${JSON.stringify(actual)}`)
  }
  return ok
}

function all4(input: string, ap: string, apa: string, chicago: string, mla: string, label: string) {
  eq(toTitleCase(input, 'ap'), ap, `${label} [AP]`)
  eq(toTitleCase(input, 'apa'), apa, `${label} [APA]`)
  eq(toTitleCase(input, 'chicago'), chicago, `${label} [Chicago]`)
  eq(toTitleCase(input, 'mla'), mla, `${label} [MLA]`)
}

// --- 1. universal basics ---
all4(
  'the lord of the rings',
  'The Lord of the Rings', 'The Lord of the Rings', 'The Lord of the Rings', 'The Lord of the Rings',
  'classic title',
)
all4('a day in the life', 'A Day in the Life', 'A Day in the Life', 'A Day in the Life', 'A Day in the Life', 'short prepositions')
all4('war and peace', 'War and Peace', 'War and Peace', 'War and Peace', 'War and Peace', 'conjunction')

// --- 2. long prepositions: the style-defining difference ---
all4(
  'walking through the park',
  'Walking Through the Park', 'Walking Through the Park', 'Walking through the Park', 'Walking through the Park',
  'long prep "through"',
)
all4(
  'life with purpose',
  'Life With Purpose', 'Life With Purpose', 'Life with Purpose', 'Life with Purpose',
  '4-letter prep "with"',
)
all4(
  'journey into the unknown',
  'Journey Into the Unknown', 'Journey Into the Unknown', 'Journey into the Unknown', 'Journey into the Unknown',
  '4-letter prep "into"',
)

// --- 3. first / last word rules ---
all4('the way', 'The Way', 'The Way', 'The Way', 'The Way', 'first word article')
all4(
  'something to live for',
  'Something to Live For', 'Something to Live For', 'Something to Live For', 'Something to Live For',
  'minor word at END capitalized',
)
all4('for whom the bell tolls', 'For Whom the Bell Tolls', 'For Whom the Bell Tolls', 'For Whom the Bell Tolls', 'For Whom the Bell Tolls', 'minor word at START capitalized')

// --- 4. colon rule ---
all4(
  'the fellowship: a new hope',
  'The Fellowship: A New Hope', 'The Fellowship: A New Hope', 'The Fellowship: A New Hope', 'The Fellowship: A New Hope',
  'word after colon',
)

// --- 5. hyphenated compounds ---
all4('mother-in-law', 'Mother-in-Law', 'Mother-in-Law', 'Mother-in-Law', 'Mother-in-Law', 'hyphen minor middle')
all4(
  'state-of-the-art design',
  'State-of-the-Art Design', 'State-of-the-Art Design', 'State-of-the-Art Design', 'State-of-the-Art Design',
  'multi-hyphen compound',
)
all4(
  'the drive-through window',
  'The Drive-Through Window', 'The Drive-Through Window', 'The Drive-through Window', 'The Drive-through Window',
  'hyphen long-prep second segment',
)

// --- 6. preservation: acronyms & brands ---
all4('the NASA mission to Mars', 'The NASA Mission to Mars', 'The NASA Mission to Mars', 'The NASA Mission to Mars', 'The NASA Mission to Mars', 'acronym preserved')
all4('the iPhone effect', 'The iPhone Effect', 'The iPhone Effect', 'The iPhone Effect', 'The iPhone Effect', 'camelCase brand preserved')

// --- 7. all-caps typed input obeys rules ---
all4('THE LORD OF THE RINGS', 'The Lord of the Rings', 'The Lord of the Rings', 'The Lord of the Rings', 'The Lord of the Rings', 'all-caps minor words normalized')
eq(toTitleCase('NASA LAUNCHES ROCKET', 'ap'), 'Nasa Launches Rocket', 'all-caps input fully normalized')

// --- 8. numbers & punctuation ---
eq(toTitleCase('the 3 musketeers', 'ap'), 'The 3 Musketeers', 'number token')
eq(toTitleCase('"the quiet american"', 'chicago'), '"The Quiet American"', 'quoted title')
eq(toTitleCase("it's a wonderful life", 'ap'), "It's a Wonderful Life", 'apostrophe token')
eq(toTitleCase('the lord of the rings!', 'ap'), 'The Lord of the Rings!', 'trailing exclamation')

// --- 9. minor-word table spot checks ---
eq(isMinorWord('through', 'ap'), false, 'through not minor in AP')
eq(isMinorWord('through', 'chicago'), true, 'through minor in Chicago')
eq(isMinorWord('with', 'apa'), false, 'with not minor in APA (4 letters)')
eq(isMinorWord('and', 'mla'), true, 'and minor everywhere')
eq(isMinorWord('cat', 'chicago'), false, 'cat is not a minor word')

// --- 10. edge cases ---
eq(toTitleCase('', 'ap'), '', 'empty input')
eq(toTitleCase('   ', 'ap'), '', 'whitespace input')
eq(toTitleCase('a', 'ap'), 'A', 'single article alone')
eq(toTitleCase('the', 'mla'), 'The', 'single "the"')

// --- 11. sentence case ---
eq(toSentenceCase('the LORD of the RINGS'), 'The lord of the rings', 'sentence case lowers all')
eq(toSentenceCase('the NASA mission'), 'The nasa mission', 'sentence case lowercases acronyms too')
eq(toSentenceCase(''), '', 'sentence case empty')
eq(toSentenceCase('ALREADY'), 'Already', 'sentence case single word')

// --- 12. idempotence: converting twice changes nothing ---
const styles: StyleGuide[] = ['ap', 'apa', 'chicago', 'mla']
const SAMPLES = [
  'the lord of the rings',
  'walking through the park',
  'the fellowship: a new hope',
  'mother-in-law',
  'THE QUICK BROWN FOX',
  'double  spaces  everywhere',
  'hello	world with	tabs',
  '  lead and trail  ',
]
for (const st of styles) {
  for (const s of SAMPLES) {
    const once = toTitleCase(s, st)
    eq(toTitleCase(once, st), once, `idempotent [${st}] ${s}`)
  }
}

console.log(`\ntotal ${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)

/* ---------------- explain mode ---------------- */
import { explainTitleCase, convertLines } from '../src/lib/titlecase'

function kinds(input: string, style: StyleGuide): string {
  return explainTitleCase(input, style)
    .filter((t) => t.type === 'word')
    .map((t) => `${t.text}:${t.kind}`)
    .join(' ')
}

eq(kinds('walking through the park', 'chicago'),
   'Walking:forced through:minor the:minor Park:forced', 'explain: chicago long prep')
eq(kinds('walking through the park', 'ap'),
   'Walking:forced Through:major the:minor Park:forced', 'explain: AP long prep major')
eq(kinds('the fellowship: a new hope', 'apa'),
   'The:forced Fellowship::major A:forced New:major Hope:forced', 'explain: colon forces next word')
eq(kinds('mother-in-law', 'ap'), 'Mother-in-Law:forced', 'explain: hyphen compound single token')
eq(kinds('the NASA mission', 'chicago'), 'The:forced NASA:major Mission:forced', 'explain: acronym major')
eq(explainTitleCase('', 'ap').length, 0, 'explain: empty input')
// explained text joined == plain conversion (must never diverge)
for (const st of ['ap', 'apa', 'chicago', 'mla'] as const) {
  for (const sample of SAMPLES) {
    const joined = explainTitleCase(sample, st).map((t) => t.text).join('')
    eq(joined, toTitleCase(sample, st), `explain matches convert [${st}] ${sample}`)
  }
}

/* ---------------- batch conversion ---------------- */
eq(convertLines('the lord of the rings\nwar and peace', 'ap').join(' | '),
   'The Lord of the Rings | War and Peace', 'batch: two lines')
eq(convertLines('  spaced line  \n\n   \nsecond one', 'chicago').length, 2, 'batch: blanks & whitespace dropped')
eq(convertLines('', 'ap').length, 0, 'batch: empty input')
eq(convertLines('walking through the park', 'chicago')[0], 'Walking through the Park', 'batch: style applied per line')

console.log(`\ntotal ${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)

/* ---------------- extras: case detective ---------------- */
import { checkTitle, countErrors, analyzeHeadline, toSlug } from '../src/lib/extras'

eq(countErrors(checkTitle('Walking Through the Park With My Dog', 'ap')), 0, 'detective: perfect AP title')
eq(countErrors(checkTitle('walking through the park with my dog', 'ap')), 6, 'detective: six lowercase majors')
eq(countErrors(checkTitle('Walking Through the Park', 'chicago')), 1, 'detective: AP habit wrong under Chicago')
eq(checkTitle('Walking Through the Park', 'chicago').filter((t) => t.status === 'wrong')[0].expected,
   'through', 'detective: expected form supplied')
eq(checkTitle('', 'ap').length, 0, 'detective: empty input')
eq(checkTitle('hope — a study', 'chicago').filter((t) => t.type === 'space').some((t) => t.text === '—'),
   true, 'detective: em dash token never graded')
eq(checkTitle('the lord of the rings', 'mla').filter((t) => t.status === 'wrong').map((t) => t.expected).join(' '),
   'The Lord Rings', 'detective: expected list matches MLA')
// detective must agree with converter on every sample
for (const st of ['ap', 'apa', 'chicago', 'mla'] as const) {
  for (const sample of SAMPLES) {
    eq(countErrors(checkTitle(toTitleCase(sample, st), st)), 0, `detective: converted title is clean [${st}] ${sample}`)
  }
}

/* ---------------- extras: headline analyzer ---------------- */
const r1 = analyzeHeadline('The Ultimate Guide: 7 Proven Secrets')
eq(r1.score, 100, 'analyzer: stacked headline maxes score')
eq(r1.hasNumber, true, 'analyzer: digit detected')
eq(r1.powerHits.join(','), 'ultimate,guide,proven,secrets', 'analyzer: power words found')
eq(r1.lengthStatus, 'ideal', 'analyzer: 36 chars is ideal')
eq(analyzeHeadline('hi').lengthStatus, 'short', 'analyzer: 2 chars is short')
eq(analyzeHeadline('x'.repeat(80)).lengthStatus, 'long', 'analyzer: 80 chars is long')
eq(analyzeHeadline('').wordCount, 0, 'analyzer: empty input zero words')
eq(analyzeHeadline('').tips.length > 0, true, 'analyzer: empty input still advises')
eq(analyzeHeadline('a heartbreaking story').emotionHits[0], 'heartbreaking', 'analyzer: emotion word found')
eq(JSON.stringify(analyzeHeadline('same input')), JSON.stringify(analyzeHeadline('same input')),
   'analyzer: deterministic')
eq(analyzeHeadline('cat dog').tips.some((t) => t.includes('5–9 words')), true, 'analyzer: word-count tip fires')

/* ---------------- extras: slug ---------------- */
eq(toSlug('State-of-the-Art Guide!'), 'state-of-the-art-guide', 'slug: punctuation dropped')
eq(toSlug("Don't Stop & Go"), 'dont-stop-and-go', 'slug: apostrophe vanishes, & becomes and')
eq(toSlug('Café René — à la mode'), 'cafe-rene-a-la-mode', 'slug: diacritics folded')
eq(toSlug('  --Hello   World-- '), 'hello-world', 'slug: dashes collapsed & trimmed')
eq(toSlug('E-commerce Trends: What the Data Says About 2026'),
   'e-commerce-trends-what-the-data-says-about-2026', 'slug: realistic headline')
eq(toSlug(''), '', 'slug: empty input')
eq(toSlug('!!!'), '', 'slug: punctuation-only input')

console.log(`\ntotal ${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
