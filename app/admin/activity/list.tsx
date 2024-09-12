import {
	Datagrid,
	List,
	TextField,
	ReferenceField,
	SelectField,
} from 'react-admin'

export const ActivityList = () => {
	return (
		<List>
			<Datagrid rowClick="edit">
				<TextField source="id" />
				<TextField source="title" />
				<SelectField
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
				/>
				<SelectField
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
				/>
				<ReferenceField source="categoryId" reference="categories" />
				<ReferenceField source="dayId" reference="days" />
			</Datagrid>
		</List>
	)
}
