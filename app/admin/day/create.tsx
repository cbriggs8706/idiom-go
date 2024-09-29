import {
	SimpleForm,
	Create,
	TextInput,
	ReferenceInput,
	required,
} from 'react-admin'

export const DayCreate = () => {
	return (
		<Create>
			<SimpleForm>
				<TextInput source="title" validate={[required()]} label="Title" />
				<ReferenceInput source="weekId" reference="weeks" />
			</SimpleForm>
		</Create>
	)
}
