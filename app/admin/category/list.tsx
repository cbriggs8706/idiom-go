import { Datagrid, List, TextField, ReferenceField } from 'react-admin'

export const CategoryList = () => {
	return (
		<List>
			<Datagrid rowClick="edit">
				<TextField source="id" />
				<TextField source="title" />
				<ReferenceField source="courseId" reference="courses" />
			</Datagrid>
		</List>
	)
}
