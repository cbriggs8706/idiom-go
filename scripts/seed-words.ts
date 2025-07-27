import 'dotenv/config'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from '../db/schema'

const sql = neon(process.env.DATABASE_URL!) as any
const db = drizzle(sql, { schema })
const { words, wordForms } = schema

// Define a type for form entries
type FormEntry = {
	formType: string
	subtype?: string
	genderPerson?: string
	heb: string
	hebNiqqud: string
	eng: string
	ipa?: string
	hebAudio?: string
}

// Sample data
const data: {
	heb: string
	hebNiqqud: string
	eng: string
	category: string
	partOfSpeech: string[]
	hebAudio: string
	forms: FormEntry[]
}[] = [
	{
		heb: 'גדול',
		hebNiqqud: 'גָּדוֹל',
		eng: 'big / great',
		category: 'adj',
		partOfSpeech: ['Adjective'],
		hebAudio: 'awb1/large big gadol.mp3',
		forms: [
			{
				formType: 'base',
				heb: 'גדול',
				hebNiqqud: 'גָּדוֹל',
				eng: 'big / great',
			},
			{
				formType: 'prefix',
				heb: 'הגדול',
				hebNiqqud: 'הַגָּדוֹל',
				eng: 'the big / great',
			},
		],
	},
	{
		heb: 'בא',
		hebNiqqud: 'בָּא',
		eng: 'he came',
		category: 'perfective',
		partOfSpeech: ['Verb'],
		hebAudio: 'awb21/he came ba.mp3',
		forms: [
			{
				formType: 'base',
				heb: 'בא',
				hebNiqqud: 'בָּא',
				eng: 'he came',
			},
			{
				formType: 'conjugation',
				subtype: 'past',
				genderPerson: '1cs',
				heb: 'בָּאתִי',
				hebNiqqud: 'בָּאתִי',
				eng: 'I came',
			},
		],
	},
]

async function seed() {
	for (const entry of data) {
		// Insert the main word
		const inserted = await db
			.insert(words)
			.values({
				heb: entry.heb,
				hebNiqqud: entry.hebNiqqud,
				eng: entry.eng,
				category: entry.category,
				partOfSpeech: entry.partOfSpeech,
				hebAudio: entry.hebAudio,
				type: 'word',
			})
			.returning({ id: words.id })

		const wordId = inserted[0].id

		// Insert forms
		for (const f of entry.forms) {
			await db.insert(wordForms).values({
				wordId,
				formType: f.formType,
				subtype: f.subtype || null,
				genderPerson: f.genderPerson || null,
				heb: f.heb,
				hebNiqqud: f.hebNiqqud,
				eng: f.eng,
				ipa: f.ipa || null,
				hebAudio: f.hebAudio || null,
			})
		}
	}

	console.log('✅ Seed complete!')
}

seed().catch((err) => {
	console.error(err)
	process.exit(1)
})
