import { Datagrid, List, TextField, ReferenceField } from 'react-admin'

export const WeekList = () => {
	return (
		<List>
			<Datagrid rowClick="edit">
				<TextField source="id" />
				<TextField source="title" />
				<ReferenceField source="scheduleId" reference="schedules" />
			</Datagrid>
		</List>
	)
}
