/**
 * Title case engine — four style guides.
 *
 *   AP      Associated Press: minor words = articles, coordinating
 *           conjunctions, and prepositions SHORTER than 4 letters.
 *   APA     APA 7: same minor set, but any word of 4+ letters is
 *           capitalized (so long prepositions like "With" go big).
 *   Chicago Chicago Manual of Style: lowercase articles, coordinating
 *           conjunctions and ALL prepositions (any length).
 *   MLA     MLA Handbook: same minor set as Chicago (plus infinitive "to").
 *
 * Universal rules: first and last words always capitalized; the word
 * after a colon / em dash is capitalized; hyphenated compounds apply the
 * minor-word logic per segment with the first segment always capitalized.
 * Tokens that are already acronyms (NASA) or mixed-case brands (iPhone)
 * are preserved as typed.
 */

export type StyleGuide = 'ap' | 'apa' | 'chicago' | 'mla'

export const STYLE_GUIDES: { code: StyleGuide; name: string; usedBy: string }[] = [
  { code: 'ap', name: 'AP Style', usedBy: 'News & journalism' },
  { code: 'apa', name: 'APA Style', usedBy: 'Academic papers' },
  { code: 'chicago', name: 'Chicago', usedBy: 'Books & publishing' },
  { code: 'mla', name: 'MLA Style', usedBy: 'Humanities essays' },
]

const ARTICLES = new Set(['a', 'an', 'the'])
const CONJUNCTIONS = new Set(['and', 'but', 'or', 'nor', 'for', 'so', 'yet', 'as', 'if'])
const PREPOSITIONS = new Set([
  'aboard', 'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'amidst',
  'among', 'amongst', 'around', 'at', 'atop', 'before', 'behind', 'below', 'beneath',
  'beside', 'besides', 'between', 'beyond', 'by', 'circa', 'concerning', 'despite',
  'down', 'during', 'except', 'from', 'in', 'inside', 'into', 'like', 'minus', 'near',
  'notwithstanding', 'of', 'off', 'on', 'onto', 'out', 'outside', 'over', 'past', 'per',
  'plus', 'regarding', 'round', 'since', 'than', 'through', 'throughout', 'till', 'to',
  'toward', 'towards', 'under', 'underneath', 'unlike', 'until', 'unto', 'up', 'upon',
  'versus', 'via', 'with', 'within', 'without',
])

/** Is this lowercase word a "minor word" under the given style? */
export function isMinorWord(lowerWord: string, style: StyleGuide): boolean {
  if (ARTICLES.has(lowerWord) || CONJUNCTIONS.has(lowerWord)) return true
  if (!PREPOSITIONS.has(lowerWord)) return false
  if (style === 'ap' || style === 'apa') return lowerWord.length < 4
  return true // chicago / mla: all prepositions lowercase
}

/** Pure-letters token already styled by the author? (NASA, iPhone, 3M…) */
function isPreservedToken(token: string): boolean {
  const letters = token.replace(/[^A-Za-z]/g, '')
  if (letters.length < 2) return false
  if (/^[A-Z]+$/.test(letters)) return true // all-caps acronym
  return /[a-z][A-Z]/.test(letters) // camelCase brand
}

/** Capitalize a word — but dictionary minor words typed in caps ("THE") obey the rules. */
function capWord(word: string, style: StyleGuide, preserve: boolean): string {
  if (!word) return word
  const lower = word.toLowerCase()
  if (isMinorWord(lower, style)) return word[0].toUpperCase() + lower.slice(1)
  if (preserve && isPreservedToken(word)) return word
  return word[0].toUpperCase() + lower.slice(1)
}

function lowerWord(word: string, style: StyleGuide, preserve: boolean): string {
  const lower = word.toLowerCase()
  if (isMinorWord(lower, style)) return lower
  if (preserve && isPreservedToken(word)) return word
  return lower
}

/**
 * Apply style rules to a hyphenated compound.
 * First segment always capitalized; the last segment is forced only when the
 * compound itself is the title's last word; other segments follow minor rules.
 */
function hyphenated(word: string, style: StyleGuide, preserve: boolean, forceLast: boolean): string {
  const segs = word.split('-')
  return segs
    .map((seg, i) => {
      if (!seg) return seg
      if (i === 0) return capWord(seg, style, preserve)
      const minor = isMinorWord(seg.toLowerCase(), style)
      if (minor && !(forceLast && i === segs.length - 1)) return lowerWord(seg, style, preserve)
      return capWord(seg, style, preserve)
    })
    .join('-')
}

interface Token {
  core: string
  lead: string
  tail: string
}

/** Split a whitespace token into leading punctuation / word core / trailing punctuation. */
function splitToken(raw: string): Token {
  const m = /^([^A-Za-z0-9&]*)([A-Za-z0-9&'-]*)([^A-Za-z0-9&'-]*)$/.exec(raw)
  if (!m) return { core: '', lead: raw, tail: '' }
  return { lead: m[1], core: m[2], tail: m[3] }
}

/** Convert a title into the given style guide's title case. */
export function toTitleCase(input: string, style: StyleGuide): string {
  if (!input.trim()) return ''
  // Preservation only applies to mixed-case input: an ALL-CAPS headline is
  // treated as shouting and fully normalized ("NASA LAUNCHES" → "Nasa Launches").
  const preserve = /[a-z]/.test(input)
  const tokens = input.split(/\s+/)
  let capNext = false
  return tokens
    .map((raw, i) => {
      const { core, lead, tail } = splitToken(raw)
      const isFirstWord = tokens.slice(0, i).every((t) => splitToken(t).core === '')
      const isLastWord = tokens.slice(i + 1).every((t) => splitToken(t).core === '')
      const afterColon = capNext
      capNext = /[:–—]\s*["'“‘‘]?$/.test(raw)
      if (!core) return raw
      if (core.includes('-')) {
        return lead + hyphenated(core, style, preserve, isLastWord) + tail
      }
      if (isFirstWord || isLastWord || afterColon) return lead + capWord(core, style, preserve) + tail
      return isMinorWord(core.toLowerCase(), style)
        ? lead + lowerWord(core, style, preserve) + tail
        : lead + capWord(core, style, preserve) + tail
    })
    .join(' ')
}

/** Sentence case: first letter capitalized, everything else lowercased. */
export function toSentenceCase(input: string): string {
  if (!input.trim()) return ''
  const lowered = input.toLowerCase()
  const i = lowered.search(/[a-z]/)
  if (i === -1) return lowered
  return lowered.slice(0, i) + lowered[i].toUpperCase() + lowered.slice(i + 1)
}

/* ---------------- word-level explanation ---------------- */

export type TokenKind = 'major' | 'minor' | 'forced'

export interface ExplainedToken {
  /** The converted text of this piece (word or whitespace). */
  text: string
  /** 'word' pieces carry a kind; 'space' pieces do not. */
  type: 'word' | 'space'
  kind?: TokenKind
}

/**
 * Convert a title and annotate every word: forced (first/last/after-colon —
 * always capitalized), minor (lowercase style words), major (everything else).
 * Powers the explain mode; follows the exact same rules as toTitleCase —
 * including whitespace normalization, so joining the pieces always
 * reproduces toTitleCase output exactly.
 */
export function explainTitleCase(input: string, style: StyleGuide): ExplainedToken[] {
  if (!input.trim()) return []
  const preserve = /[a-z]/.test(input)
  const tokens = input.split(/\s+/)
  const out: ExplainedToken[] = []
  let capNext = false

  tokens.forEach((raw, i) => {
    if (i > 0) out.push({ text: ' ', type: 'space' })
    const { core, lead, tail } = splitToken(raw)
    if (!core) {
      out.push({ text: raw, type: 'space' })
      return
    }
    const isFirstWord = tokens.slice(0, i).every((t) => splitToken(t).core === '')
    const isLastWord = tokens.slice(i + 1).every((t) => splitToken(t).core === '')
    const afterColon = capNext
    capNext = /[:–—]\s*["'“‘]?$/.test(raw)

    const forced = isFirstWord || isLastWord || afterColon
    if (core.includes('-')) {
      out.push({ text: lead + hyphenated(core, style, preserve, isLastWord) + tail, type: 'word', kind: forced ? 'forced' : 'major' })
      return
    }
    if (forced) {
      out.push({ text: lead + capWord(core, style, preserve) + tail, type: 'word', kind: 'forced' })
      return
    }
    if (isMinorWord(core.toLowerCase(), style)) {
      out.push({ text: lead + lowerWord(core, style, preserve) + tail, type: 'word', kind: 'minor' })
      return
    }
    out.push({ text: lead + capWord(core, style, preserve) + tail, type: 'word', kind: 'major' })
  })
  return out
}

/** Batch helper: convert every non-empty line, preserving line order. */
export function convertLines(input: string, style: StyleGuide): string[] {
  return input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => toTitleCase(line, style))
}
