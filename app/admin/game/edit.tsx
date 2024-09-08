import {
	SimpleForm,
	Edit,
	TextInput,
	ReferenceInput,
	NumberInput,
	required,
} from 'react-admin'

export const GameEdit = () => {
	return (
		<Edit>
			<SimpleForm>
				<TextInput source="title" validate={[required()]} label="Title" />
				<ReferenceInput source="playLessonId" reference="playLessons" />
				<TextInput source="title" validate={[required()]} label="Src" />

				<NumberInput source="order" validate={[required()]} label="Order" />
			</SimpleForm>
		</Edit>
	)
}
