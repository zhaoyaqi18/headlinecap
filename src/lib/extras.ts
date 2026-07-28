/**
 * Extras engine — headline tooling beyond conversion.
 *
 *   checkTitle      Compare a typed headline against the correct title case,
 *                   word by word (the "Case Detective" / grading mode).
 *   analyzeHeadline Deterministic headline scoring: length, word count,
 *                   power / emotional word hits, presence of a number.
 *   toSlug          URL-slug generation (diacritics folded, "&" → "and").
 *
 * Everything here is pure and deterministic — no network, no heuristics
 * beyond fixed dictionaries, same accuracy bar as the converter engine.
 */

import { toTitleCase, type StyleGuide } from './titlecase'

/* ---------------- case detective ---------------- */

export interface CheckedToken {
  /** The token as the user typed it (words and whitespace). */
  text: string
  type: 'word' | 'space'
  /** Words only: does the typed casing match the style guide? */
  status?: 'ok' | 'wrong'
  /** Words only, when wrong: the correctly styled form. */
  expected?: string
}

/**
 * Grade a headline against a style guide. Every word is marked ok/wrong;
 * wrong words carry the expected form. Whitespace is preserved for display.
 */
export function checkTitle(input: string, style: StyleGuide): CheckedToken[] {
  if (!input.trim()) return []
  const pieces = input.split(/(\s+)/)
  // Word-token alignment: toTitleCase preserves every word token (with its
  // punctuation), so filtering both sides to alnum-bearing tokens gives an
  // exact 1:1 correspondence — punctuation-only tokens and empty artifacts
  // from irregular whitespace are dropped symmetrically.
  const correct = toTitleCase(input, style)
    .split(/\s+/)
    .filter((t) => /[A-Za-z0-9]/.test(t))
  let wordIdx = 0
  return pieces.map((piece) => {
    if (!piece || /^\s+$/.test(piece)) return { text: piece, type: 'space' as const }
    if (!/[A-Za-z0-9]/.test(piece)) return { text: piece, type: 'space' as const }
    const expected = correct[wordIdx++]
    if (expected === undefined) return { text: piece, type: 'space' as const }
    return piece === expected
      ? { text: piece, type: 'word' as const, status: 'ok' as const }
      : { text: piece, type: 'word' as const, status: 'wrong' as const, expected }
  })
}

/** Count of wrongly-cased words in a checkTitle result. */
export function countErrors(tokens: CheckedToken[]): number {
  return tokens.filter((t) => t.status === 'wrong').length
}

/* ---------------- headline analyzer ---------------- */

/** Words proven to lift click-through (curated, deterministic matching). */
const POWER_WORDS = new Set([
  'free', 'new', 'proven', 'secret', 'secrets', 'easy', 'easiest', 'ultimate',
  'best', 'now', 'how', 'why', 'guide', 'essential', 'simple', 'quick',
  'guaranteed', 'exclusive', 'instant', 'complete', 'powerful', 'hack',
  'hacks', 'boost', 'discover', 'master', 'unlock', 'win', 'save', 'fast',
  'today', 'breakthrough', 'effortless', 'insider', 'limited', 'mistakes',
  'truth', 'warning', 'step', 'steps', 'epic', 'must',
])

/** High-emotion words (curiosity / awe / outrage family). */
const EMOTION_WORDS = new Set([
  'amazing', 'shocking', 'shocked', 'heartbreaking', 'inspiring', 'inspired',
  'hilarious', 'terrifying', 'stunning', 'unbelievable', 'brilliant', 'weird',
  'devastating', 'joyful', 'furious', 'adorable', 'creepy', 'outrageous',
  'incredible', 'wonderful', 'horrible', 'exciting', 'surprising', 'bizarre',
  'gorgeous', 'tragic', 'breathtaking', 'alarming', 'uplifting', 'jaw-dropping',
])

export type LengthStatus = 'short' | 'ideal' | 'long'

export interface HeadlineReport {
  charCount: number
  wordCount: number
  /** SEO title-tag comfort zone is roughly 30–60 characters. */
  lengthStatus: LengthStatus
  powerHits: string[]
  emotionHits: string[]
  hasNumber: boolean
  /** 0–100 deterministic score. */
  score: number
  /** Human-readable improvement tips, ordered by impact. */
  tips: string[]
}

/** Analyze a headline. Deterministic: same input always yields same report. */
export function analyzeHeadline(text: string): HeadlineReport {
  const charCount = text.length
  const words = (text.toLowerCase().match(/[a-z0-9][a-z0-9'-]*/g) ?? []) as string[]
  const wordCount = words.length

  const lengthStatus: LengthStatus = charCount < 30 ? 'short' : charCount <= 60 ? 'ideal' : 'long'
  const powerHits = [...new Set(words.filter((w) => POWER_WORDS.has(w)))]
  const emotionHits = [...new Set(words.filter((w) => EMOTION_WORDS.has(w)))]
  const hasNumber = /\d/.test(text)

  let score = 40
  score += lengthStatus === 'ideal' ? 20 : lengthStatus === 'short' ? 8 : 4
  score += wordCount >= 5 && wordCount <= 9 ? 10 : wordCount > 0 ? 4 : 0
  score += Math.min(powerHits.length, 2) * 10
  score += Math.min(emotionHits.length, 1) * 10
  score += hasNumber ? 10 : 0
  score = Math.min(100, score)

  const tips: string[] = []
  if (lengthStatus === 'short') tips.push('Too short for a search snippet — aim for 30–60 characters.')
  if (lengthStatus === 'long') tips.push('Over 60 characters — search results will truncate it.')
  if (wordCount > 0 && (wordCount < 5 || wordCount > 9)) tips.push('Headlines of 5–9 words get the most clicks.')
  if (powerHits.length === 0) tips.push('Add a power word (free, proven, ultimate, how…) to lift click-through.')
  if (emotionHits.length === 0) tips.push('An emotional word (amazing, shocking, brilliant…) makes it memorable.')
  if (!hasNumber) tips.push('Numbers in headlines ("7 Ways…") consistently outperform.')
  if (tips.length === 0) tips.push('Nothing to fix — this headline is doing everything right.')

  return { charCount, wordCount, lengthStatus, powerHits, emotionHits, hasNumber, score, tips }
}

/* ---------------- slug generator ---------------- */

/** Turn a headline into a URL slug: "State-of-the-Art Guide!" → "state-of-the-art-guide". */
export function toSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip combining diacritics (e-acute folds to e)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[’']/g, '') // apostrophes vanish: "don't" → "dont"
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}
