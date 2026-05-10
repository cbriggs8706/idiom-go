import type { HebrewGuessKind, HebrewGuessingFacts, HebrewVocab } from '@/lib/vocab'

export type HebrewGuessFacts = {
	kind: HebrewGuessKind
	isPerson: boolean
	isPlace: boolean
	isThing: boolean
	isNumber: boolean
	isLetter: boolean
	isMale: boolean
	isFemale: boolean
	isLand: boolean
	isCity: boolean
	isRiver: boolean
	isMountain: boolean
	isAnimal: boolean
	isProphet: boolean
	hasChildren: boolean
	fatherAbraham: boolean
	inNumbers: boolean
	wentDownToEgypt: boolean
}

export type HebrewGuessCandidate = {
	key: string
	card: HebrewVocab
	facts: HebrewGuessFacts
}

export type HebrewGuessQuestion = {
	key: string
	question: string
	affirmative: string
	match: (candidate: HebrewGuessCandidate) => boolean
}

const HEBREW_NIQQUD_REGEX = /[\u0591-\u05BD\u05BF-\u05C7]/g

function stripNiqqud(text: string) {
	return text.normalize('NFKC').replace(HEBREW_NIQQUD_REGEX, '')
}

function normalizeEnglishGloss(text: string) {
	return text.toLowerCase().replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim()
}

function normalizeGender(value?: string) {
	const normalized = String(value ?? '').trim().toLowerCase()
	if (!normalized) return ''
	if (normalized.startsWith('f')) return 'f'
	if (normalized.startsWith('m')) return 'm'
	return ''
}

function detectKind(card: HebrewVocab, gloss: string): HebrewGuessKind {
	const category = String(card.category ?? '').toLowerCase()

	if (category === 'number') return 'number'
	if (category === 'letter') return 'letter'

	const placeHints = [
		'place name',
		'land',
		'country',
		'city',
		'river',
		'mountain',
		'sea',
		'desert',
		'wilderness',
	]
	if (placeHints.some((hint) => gloss.includes(hint))) {
		return 'place'
	}

	const personHints = [
		'proper name',
		'man',
		'woman',
		'king',
		'queen',
		'prophet',
		'servant',
		'maidservant',
		'wife',
		'mother',
		'father',
		'son',
		'daughter',
	]
	if (personHints.some((hint) => gloss.includes(hint))) {
		return 'person'
	}

	if (category === 'name') {
		return 'person'
	}

	return 'thing'
}

function normalizeGuessingFacts(input: HebrewGuessingFacts | undefined) {
	if (!input) return undefined

	const normalized: HebrewGuessingFacts = {}

	for (const [key, value] of Object.entries(input)) {
		if (typeof value === 'string') {
			const trimmed = value.trim()
			if (trimmed) {
				normalized[key] = trimmed
			}
			continue
		}

		if (typeof value === 'boolean') {
			normalized[key] = value
			continue
		}

		if (Array.isArray(value)) {
			const strings = value
				.filter((item): item is string => typeof item === 'string')
				.map((item) => item.trim())
				.filter(Boolean)

			if (strings.length > 0) {
				normalized[key] = strings
			}
		}
	}

	return Object.keys(normalized).length > 0 ? normalized : undefined
}

function baseFactsForCard(card: HebrewVocab): HebrewGuessFacts {
	const gloss = normalizeEnglishGloss(card.eng)
	const kind = detectKind(card, gloss)
	const gender = normalizeGender(card.genderPerson)

	return {
		kind,
		isPerson: kind === 'person',
		isPlace: kind === 'place',
		isThing: kind === 'thing',
		isNumber: kind === 'number',
		isLetter: kind === 'letter',
		isMale: gender === 'm',
		isFemale: gender === 'f',
		isLand: gloss.includes('land') || gloss.includes('country'),
		isCity: gloss.includes('city'),
		isRiver: gloss.includes('river'),
		isMountain: gloss.includes('mountain'),
		isAnimal:
			gloss.includes('animal') ||
			gloss.includes('ram') ||
			gloss.includes('ewe') ||
			gloss.includes('goat') ||
			gloss.includes('sheep') ||
			gloss.includes('horse') ||
			gloss.includes('lion') ||
			gloss.includes('dog') ||
			gloss.includes('bird'),
		isProphet: gloss.includes('prophet'),
		hasChildren:
			gloss.includes('mother') ||
			gloss.includes('father') ||
			gloss.includes('king'),
		fatherAbraham: false,
		inNumbers: false,
		wentDownToEgypt: false,
	}
}

export function buildHebrewGuessCandidate(card: HebrewVocab): HebrewGuessCandidate {
	const base = baseFactsForCard(card)
	const guessingFacts = normalizeGuessingFacts(card.guessingFacts)
	const kindFromFacts =
		guessingFacts?.kind &&
		['person', 'place', 'thing', 'number', 'letter'].includes(guessingFacts.kind)
			? (guessingFacts.kind as HebrewGuessKind)
			: undefined
	const books = Array.isArray(guessingFacts?.books) ? guessingFacts.books : []
	const father = typeof guessingFacts?.father === 'string' ? guessingFacts.father : ''

	const facts: HebrewGuessFacts = {
		...base,
		kind: kindFromFacts ?? base.kind,
		isPerson: kindFromFacts ? kindFromFacts === 'person' : base.isPerson,
		isPlace: kindFromFacts ? kindFromFacts === 'place' : base.isPlace,
		isThing: kindFromFacts ? kindFromFacts === 'thing' : base.isThing,
		isNumber: kindFromFacts ? kindFromFacts === 'number' : base.isNumber,
		isLetter: kindFromFacts ? kindFromFacts === 'letter' : base.isLetter,
		isProphet:
			typeof guessingFacts?.isProphet === 'boolean'
				? guessingFacts.isProphet
				: base.isProphet,
		hasChildren:
			typeof guessingFacts?.hasChildren === 'boolean'
				? guessingFacts.hasChildren
				: base.hasChildren,
		wentDownToEgypt:
			typeof guessingFacts?.wentDownToEgypt === 'boolean'
				? guessingFacts.wentDownToEgypt
				: base.wentDownToEgypt,
		fatherAbraham: stripNiqqud(father) === 'אברהם',
		inNumbers: books.some((book) => {
			const normalized = book.trim().toLowerCase()
			return normalized === 'numbers' || normalized === 'במדבר'
		}),
	}

	return {
		key: `${card.id ?? stripNiqqud(card.heb)}`,
		card,
		facts,
	}
}

export const HEBREW_WHATS_THIS_QUESTIONS: HebrewGuessQuestion[] = [
	{
		key: 'isPerson',
		question: 'הֲזֶה אִישׁ',
		affirmative: 'זֶה אִישׁ',
		match: (candidate) => candidate.facts.isPerson,
	},
	{
		key: 'isPlace',
		question: 'הֲזֶה מָקוֹם',
		affirmative: 'זֶה מָקוֹם',
		match: (candidate) => candidate.facts.isPlace,
	},
	{
		key: 'isThing',
		question: 'הֲזֶה דָּבָר',
		affirmative: 'זֶה דָּבָר',
		match: (candidate) => candidate.facts.isThing,
	},
	{
		key: 'isNumber',
		question: 'הֲזֶה מִסְפָּר',
		affirmative: 'זֶה מִסְפָּר',
		match: (candidate) => candidate.facts.isNumber,
	},
	{
		key: 'isLetter',
		question: 'הֲזֹאת אוֹת',
		affirmative: 'זֹאת אוֹת',
		match: (candidate) => candidate.facts.isLetter,
	},
	{
		key: 'isMale',
		question: 'הֲזֶה זָכָר',
		affirmative: 'זֶה זָכָר',
		match: (candidate) => candidate.facts.isMale,
	},
	{
		key: 'isFemale',
		question: 'הֲזֹאת נְקֵבָה',
		affirmative: 'זֹאת נְקֵבָה',
		match: (candidate) => candidate.facts.isFemale,
	},
	{
		key: 'isLand',
		question: 'הֲזֹאת אֶרֶץ',
		affirmative: 'זֹאת אֶרֶץ',
		match: (candidate) => candidate.facts.isLand,
	},
	{
		key: 'isCity',
		question: 'הֲזֹאת עִיר',
		affirmative: 'זֹאת עִיר',
		match: (candidate) => candidate.facts.isCity,
	},
	{
		key: 'isRiver',
		question: 'הֲזֶה נָהָר',
		affirmative: 'זֶה נָהָר',
		match: (candidate) => candidate.facts.isRiver,
	},
	{
		key: 'isMountain',
		question: 'הֲזֶה הַר',
		affirmative: 'זֶה הַר',
		match: (candidate) => candidate.facts.isMountain,
	},
	{
		key: 'isAnimal',
		question: 'הֲזֶה בַּעַל־חַי',
		affirmative: 'זֶה בַּעַל־חַי',
		match: (candidate) => candidate.facts.isAnimal,
	},
	{
		key: 'isProphet',
		question: 'הֲהוּא נָבִיא',
		affirmative: 'הוּא נָבִיא',
		match: (candidate) => candidate.facts.isProphet,
	},
	{
		key: 'fatherAbraham',
		question: 'הֲאָבִיו אַבְרָהָם',
		affirmative: 'אָבִיו אַבְרָהָם',
		match: (candidate) => candidate.facts.fatherAbraham,
	},
	{
		key: 'hasChildren',
		question: 'הֲיֵשׁ־לוֹ בָּנִים',
		affirmative: 'יֵשׁ־לוֹ בָּנִים',
		match: (candidate) => candidate.facts.hasChildren,
	},
	{
		key: 'inNumbers',
		question: 'הֲהוּא בְּסֵפֶר בַּמִּדְבָּר',
		affirmative: 'הוּא בְּסֵפֶר בַּמִּדְבָּר',
		match: (candidate) => candidate.facts.inNumbers,
	},
	{
		key: 'wentDownToEgypt',
		question: 'הֲהוּא יָרַד מִצְרַיְמָה',
		affirmative: 'הוּא יָרַד מִצְרַיְמָה',
		match: (candidate) => candidate.facts.wentDownToEgypt,
	},
]

export function normalizeHebrewConsonants(input: string): string {
	return input
		.normalize('NFKC')
		.replace(HEBREW_NIQQUD_REGEX, '')
		.replace(/[שׁשׂ]/g, 'ש')
}

export function normalizeHebrewPointed(input: string): string {
	return input
		.normalize('NFKC')
		.replace(/[\u0591-\u05AF]/g, '')
		.replace(/[שׁ]/g, 'שׁ')
		.replace(/[שׂ]/g, 'שׂ')
}
