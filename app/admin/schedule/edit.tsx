import {
	SimpleForm,
	Edit,
	TextInput,
	ReferenceInput,
	NumberInput,
	required,
} from 'react-admin'

export const ScheduleEdit = () => {
	return (
		<Edit>
			<SimpleForm>
				<NumberInput source="id" validate={[required()]} label="Id" />
				<TextInput source="title" validate={[required()]} label="Title" />
				<ReferenceInput source="courseId" reference="courses" />
			</SimpleForm>
		</Edit>
	)
}
