import {
	SimpleForm,
	Create,
	TextInput,
	ReferenceInput,
	NumberInput,
	required,
} from 'react-admin'

export const GameCreate = () => {
	return (
		<Create>
			<SimpleForm>
				<TextInput source="title" validate={[required()]} label="Title" />
				<ReferenceInput source="playLessonId" reference="playLessons" />
				<TextInput source="src" validate={[required()]} label="Src" />
				<NumberInput source="order" validate={[required()]} label="Order" />
			</SimpleForm>
		</Create>
	)
}
