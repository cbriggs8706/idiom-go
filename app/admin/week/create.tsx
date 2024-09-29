import {
	SimpleForm,
	Create,
	TextInput,
	ReferenceInput,
	required,
} from 'react-admin'

export const WeekCreate = () => {
	return (
		<Create>
			<SimpleForm>
				<TextInput source="title" validate={[required()]} label="Title" />
				<ReferenceInput source="scheduleId" reference="schedules" />
			</SimpleForm>
		</Create>
	)
}
