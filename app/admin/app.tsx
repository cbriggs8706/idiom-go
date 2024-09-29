'use client'

import { Admin, Resource } from 'react-admin'
import simpleRestProvider from 'ra-data-simple-rest'

import { CourseList } from './course/list'
import { CourseEdit } from './course/edit'
import { CourseCreate } from './course/create'

import { UnitList } from './unit/list'
import { UnitEdit } from './unit/edit'
import { UnitCreate } from './unit/create'

import { LessonList } from './lesson/list'
import { LessonEdit } from './lesson/edit'
import { LessonCreate } from './lesson/create'

import { ChallengeList } from './challenge/list'
import { ChallengeEdit } from './challenge/edit'
import { ChallengeCreate } from './challenge/create'

import { ChallengeOptionList } from './challengeOption/list'
import { ChallengeOptionEdit } from './challengeOption/edit'
import { ChallengeOptionCreate } from './challengeOption/create'
// import { PlayLessonList } from './playLesson/list'
// import { PlayLessonCreate } from './playLesson/create'
// import { PlayLessonEdit } from './playLesson/edit'
// import { GameList } from './game/list'
// import { GameCreate } from './game/create'
// import { GameEdit } from './game/edit'

// import { ScheduleList } from './schedule/list'
// import { ScheduleCreate } from './schedule/create'
// import { ScheduleEdit } from './schedule/edit'
// import { WeekList } from './week/list'
// import { WeekCreate } from './week/create'
// import { WeekEdit } from './week/edit'
// import { DayList } from './day/list'
// import { DayCreate } from './day/create'
// import { DayEdit } from './day/edit'

// import { CategoryList } from './category/list'
// import { CategoryCreate } from './category/create'
// import { CategoryEdit } from './category/edit'
// import { ActivityList } from './activity/list'
// import { ActivityCreate } from './activity/create'
// import { ActivityEdit } from './activity/edit'

const dataProvider = simpleRestProvider('/api')

const App = () => {
	return (
		<Admin dataProvider={dataProvider}>
			<Resource
				name="courses"
				list={CourseList}
				create={CourseCreate}
				edit={CourseEdit}
				recordRepresentation="title"
			/>
			<Resource
				name="units"
				list={UnitList}
				create={UnitCreate}
				edit={UnitEdit}
				recordRepresentation="title"
			/>
			<Resource
				name="lessons"
				list={LessonList}
				create={LessonCreate}
				edit={LessonEdit}
				recordRepresentation="title"
			/>
			<Resource
				name="challenges"
				list={ChallengeList}
				create={ChallengeCreate}
				edit={ChallengeEdit}
				recordRepresentation="question"
			/>
			<Resource
				name="challengeOptions"
				list={ChallengeOptionList}
				create={ChallengeOptionCreate}
				edit={ChallengeOptionEdit}
				recordRepresentation="text"
				options={{ label: 'Challenge Options' }}
			/>
			<hr />
			{/* <Resource
				name="playLessons"
				list={PlayLessonList}
				create={PlayLessonCreate}
				edit={PlayLessonEdit}
				recordRepresentation="text"
				options={{ label: 'Play Lesson' }}
			/>
			<Resource
				name="games"
				list={GameList}
				create={GameCreate}
				edit={GameEdit}
				recordRepresentation="text"
			/>
			<Resource
				name="schedules"
				list={ScheduleList}
				create={ScheduleCreate}
				edit={ScheduleEdit}
				recordRepresentation="title"
			/>
			<Resource
				name="weeks"
				list={WeekList}
				create={WeekCreate}
				edit={WeekEdit}
				recordRepresentation="title"
			/>
			<Resource
				name="days"
				list={DayList}
				create={DayCreate}
				edit={DayEdit}
				recordRepresentation="title"
			/>
			<Resource
				name="categories"
				list={CategoryList}
				create={CategoryCreate}
				edit={CategoryEdit}
				recordRepresentation="title"
			/>
			<Resource
				name="activities"
				list={ActivityList}
				create={ActivityCreate}
				edit={ActivityEdit}
				recordRepresentation="title"
			/> */}
		</Admin>
	)
}

export default App
