import {
	Datagrid,
	List,
	TextField,
	ReferenceField,
	NumberField,
} from 'react-admin'

export const GameList = () => {
	return (
		<List>
			<Datagrid rowClick="edit">
				<TextField source="id" />
				<TextField source="title" />
				<ReferenceField source="playLessonId" reference="playLessons" />
				<NumberField source="order" />
			</Datagrid>
		</List>
	)
}
