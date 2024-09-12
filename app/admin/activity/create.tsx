import {
	SimpleForm,
	Create,
	TextInput,
	ReferenceInput,
	NumberInput,
	required,
	SelectInput,
} from 'react-admin'

export const ActivityCreate = () => {
	return (
		<Create>
			<SimpleForm>
				<TextInput source="title" validate={[required()]} label="Title" />
				<SelectInput
					source="type"
					choices={[
						{
							id: 'SELECT',
							name: 'SELECT',
						},
						{
							id: 'ASSIST',
							name: 'ASSIST',
						},
						{
							id: 'HEAR',
							name: 'HEAR',
						},
					]}
					validate={[required()]}
				/>
				<SelectInput
					source="lessonNumber"
					choices={[
						{
							id: '1',
							name: '1',
						},
						{
							id: '2',
							name: '2',
						},
						{
							id: '3',
							name: '3',
						},
					]}
					validate={[required()]}
				/>
				<ReferenceInput source="categoryId" reference="categories" />
				<ReferenceInput source="dayId" reference="days" />
			</SimpleForm>
		</Create>
	)
}
