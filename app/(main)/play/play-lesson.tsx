// import { games, playLessons } from '@/db/schema'

// import { PlayLessonBanner } from './play-lesson-banner'
// import { GameButton } from './game-button'

// type Props = {
// 	id: number
// 	order: number
// 	title: string
// 	description: string
// 	games: (typeof games.$inferSelect & {
// 		completed: boolean
// 	})[]
// }

// export const PlayLesson = ({ id, order, title, description, games }: Props) => {
// 	return (
// 		<>
// 			<PlayLessonBanner title={title} description={description} />
// 			<div className="flex items-center flex-col relative">
// 				{games.map((lesson, index) => {
// 					return (
// 						<GameButton
// 							key={lesson.id}
// 							id={lesson.id}
// 							index={index}
// 							totalCount={games.length - 1}
// 						/>
// 					)
// 				})}
// 			</div>
// 		</>
// 	)
// }
