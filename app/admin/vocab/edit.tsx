import { SimpleForm, Edit, TextInput, NumberInput, required } from 'react-admin'

export const VocabEdit = () => {
	return (
		<Edit>
			<SimpleForm>
				<TextInput source="hebrew" validate={[required()]} label="Hebrew" />
				<TextInput source="hebrewWNiqqud" label="Hebrew w/Niqqud" />
				<TextInput source="phonemicAudioSrc" label="Phonemic Audio Src" />
				<TextInput source="slowAudioSrc" label="Slow Audio Src" />
				<TextInput source="fastAudioSrc" label="Fast Audio Src" />
				<TextInput source="images" label="Images" />
				<TextInput source="partOfSpeech" label="Part of Speech" />
				<TextInput source="ipa" label="IPA" />
				<TextInput source="transliteration" label="transliteration" />
				<TextInput source="frontMouth" label="Front of Mouth GIF" />
				<TextInput source="anatomy" label="Anatomy GIF" />
				<TextInput source="gematria" label="Gematria Value" />
				<TextInput source="paleo" label="Paleo" />
				<TextInput source="proto" label="Proto" />
				<TextInput source="cursive" label="Cursive" />
				<TextInput source="contextClips" label="Context Clips" />
				<TextInput source="contextSentences" label="Title" />
				<TextInput source="bibleHub" label="Title" />
				<NumberInput source="lessons" label="Order" />
			</SimpleForm>
		</Edit>
	)
}
