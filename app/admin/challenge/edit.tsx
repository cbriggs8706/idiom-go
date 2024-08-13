import {
	SimpleForm,
	Edit,
	TextInput,
	ReferenceInput,
	NumberInput,
	required,
	SelectInput,
} from 'react-admin'

export const ChallengeEdit = () => {
	return (
		<Edit>
			<SimpleForm>
				<TextInput source="question" validate={[required()]} label="Question" />
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
				<ReferenceInput source="lessonId" reference="lessons" />
				<NumberInput source="order" validate={[required()]} label="Order" />
				<TextInput source="video" label="Video Url" />
			</SimpleForm>
		</Edit>
	)
}
