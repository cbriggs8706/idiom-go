import {
	SimpleForm,
	Edit,
	TextInput,
	ReferenceInput,
	NumberInput,
	required,
} from 'react-admin'

export const WeekEdit = () => {
	return (
		<Edit>
			<SimpleForm>
				<NumberInput source="id" validate={[required()]} label="Id" />
				<TextInput source="title" validate={[required()]} label="Title" />
				<ReferenceInput source="scheduleId" reference="schedules" />
			</SimpleForm>
		</Edit>
	)
}
