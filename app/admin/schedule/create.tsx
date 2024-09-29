import {
	SimpleForm,
	Create,
	TextInput,
	ReferenceInput,
	required,
} from 'react-admin'

export const ScheduleCreate = () => {
	return (
		<Create>
			<SimpleForm>
				<TextInput source="title" validate={[required()]} label="Title" />

				<ReferenceInput source="courseId" reference="courses" />
			</SimpleForm>
		</Create>
	)
}
