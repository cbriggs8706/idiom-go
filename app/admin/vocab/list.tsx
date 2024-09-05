import { Datagrid, List, TextField } from 'react-admin'

export const VocabList = () => {
	return (
		<List>
			<Datagrid rowClick="edit">
				<TextField source="hebrew" label="Hebrew" />
				<TextField source="hebrewWNiqqud" label="Hebrew w/Niqqud" />
				<TextField source="phonemicAudioSrc" label="Phonemic Audio Src" />
				<TextField source="slowAudioSrc" label="Slow Audio Src" />
				<TextField source="fastAudioSrc" label="Fast Audio Src" />
				<TextField source="images" label="Images" />
				<TextField source="partOfSpeech" label="Part of Speech" />
				<TextField source="ipa" label="IPA" />
				<TextField source="transliteration" label="transliteration" />
				<TextField source="frontMouth" label="Front of Mouth GIF" />
				<TextField source="anatomy" label="Anatomy GIF" />
				<TextField source="gematria" label="Gematria Value" />
				<TextField source="paleo" label="Paleo" />
				<TextField source="proto" label="Proto" />
				<TextField source="cursive" label="Cursive" />
				<TextField source="contextClips" label="Context Clips" />
				<TextField source="contextSentences" label="Title" />
				<TextField source="bibleHub" label="Title" />
				<TextField source="lessons" label="Order" />
			</Datagrid>
		</List>
	)
}
