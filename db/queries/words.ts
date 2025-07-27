import { words, wordForms } from '@/db/schema'
import { eq } from 'drizzle-orm'
import db from '../drizzle'

export async function getAllDictionaryEntries() {
	const allWords = await db.select().from(words)
	const allForms = await db.select().from(wordForms)

	return [
		// ✅ Base words
		...allWords.map((w) => ({
			id: w.id,
			heb: w.heb ?? '', // ensure string
			hebNiqqud: w.hebNiqqud ?? '',
			eng: w.eng ?? '',
			engDefinition: w.engDefinition ?? '',
			genderPerson: w.genderPerson ?? '',
			partOfSpeech: w.partOfSpeech ?? [],
			ipa: w.ipa ?? '',
			engTransliteration: w.engTransliteration ?? '',
			dictionaryUrl: w.dictionaryUrl ?? '',
			images: w.images ?? [],
			hebAudio: w.hebAudio ?? '',
			engAudio: w.engAudio ?? '',
			synonyms: w.synonyms ?? [],
			antonyms: w.antonyms ?? [],
			lessons: w.lessons ?? [],
			scriptures: w.scriptures ?? [],
			strongs: w.strongs ?? '',
			type: w.type ?? 'word',
			category: w.category ?? '',
		})),

		// ✅ Forms (prefixes, conjugations, etc.)
		...allForms.map((f) => {
			const parent = allWords.find((pw) => pw.id === f.wordId)

			return {
				id: f.id, // use form id
				heb: f.heb ?? '',
				hebNiqqud: f.hebNiqqud ?? '',
				eng: f.eng || parent?.eng || '',
				engDefinition: parent?.engDefinition ?? '',
				genderPerson: f.genderPerson || parent?.genderPerson || '',
				partOfSpeech: parent?.partOfSpeech ?? [],
				ipa: f.ipa || parent?.ipa || '',
				engTransliteration: parent?.engTransliteration ?? '',
				dictionaryUrl: parent?.dictionaryUrl ?? '',
				images: parent?.images ?? [],
				hebAudio: f.hebAudio || parent?.hebAudio || '',
				engAudio: parent?.engAudio ?? '',
				synonyms: parent?.synonyms ?? [],
				antonyms: parent?.antonyms ?? [],
				lessons: f.lessons?.length ? f.lessons : parent?.lessons ?? [],
				scriptures: f.scriptures?.length
					? f.scriptures
					: parent?.scriptures ?? [],
				strongs: parent?.strongs ?? '',
				type: parent?.type ?? 'word',
				category: parent?.category ?? '',
			}
		}),
	]
}
