import { Datagrid, List, TextField, ReferenceField } from 'react-admin'

export const DayList = () => {
	return (
		<List>
			<Datagrid rowClick="edit">
				<TextField source="id" />
				<TextField source="title" />
				<ReferenceField source="weekId" reference="weeks" />
			</Datagrid>
		</List>
	)
}
