import { relations } from 'drizzle-orm'
import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
} from 'drizzle-orm/pg-core'

export const courses = pgTable('courses', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	imageSrc: text('image_src').notNull(),
})

export const coursesRelations = relations(courses, ({ many }) => ({
	userProgress: many(userProgress),
	units: many(units),
	categories: many(categories),
	schedules: many(schedules),
}))

export const units = pgTable('units', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(), // Unit 1
	description: text('description').notNull(), // Learn the basics of spanish
	courseId: integer('course_id')
		.references(() => courses.id, { onDelete: 'cascade' })
		.notNull(),
	order: integer('order').notNull(),
})

export const unitsRelations = relations(units, ({ many, one }) => ({
	course: one(courses, {
		fields: [units.courseId],
		references: [courses.id],
	}),
	lessons: many(lessons),
}))

export const lessons = pgTable('lessons', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	unitId: integer('unit_id')
		.references(() => units.id, { onDelete: 'cascade' })
		.notNull(),
	order: integer('order').notNull(),
})

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
	unit: one(units, {
		fields: [lessons.unitId],
		references: [units.id],
	}),
	challenges: many(challenges),
}))

export const challengesEnum = pgEnum('type', ['SELECT', 'ASSIST', 'HEAR'])

export const challenges = pgTable('challenges', {
	id: serial('id').primaryKey(),
	lessonId: integer('lesson_id')
		.references(() => lessons.id, { onDelete: 'cascade' })
		.notNull(),
	type: challengesEnum('type').notNull(),
	question: text('question').notNull(),
	order: integer('order').notNull(),
	video: text('video'),
})

export const challengesRelations = relations(challenges, ({ one, many }) => ({
	lesson: one(lessons, {
		fields: [challenges.lessonId],
		references: [lessons.id],
	}),
	challengeOptions: many(challengeOptions),
	challengeProgress: many(challengeProgress),
}))

export const challengeOptions = pgTable('challenge_options', {
	id: serial('id').primaryKey(),
	challengeId: integer('challenge_id')
		.references(() => challenges.id, { onDelete: 'cascade' })
		.notNull(),
	text: text('text').notNull(),
	correct: boolean('correct').notNull(),
	imageSrc: text('image_src'),
	audioSrc: text('audio_src'),
})

export const challengeOptionsRelations = relations(
	challengeOptions,
	({ one }) => ({
		challenge: one(challenges, {
			fields: [challengeOptions.challengeId],
			references: [challenges.id],
		}),
	})
)

export const challengeProgress = pgTable('challenge_progress', {
	id: serial('id').primaryKey(),
	userId: text('user_id').notNull(),
	challengeId: integer('challenge_id')
		.references(() => challenges.id, { onDelete: 'cascade' })
		.notNull(),
	completed: boolean('completed').notNull().default(false),
})

export const challengeProgressRelations = relations(
	challengeProgress,
	({ one }) => ({
		challenge: one(challenges, {
			fields: [challengeProgress.challengeId],
			references: [challenges.id],
		}),
	})
)

export const userProgress = pgTable('user_progress', {
	userId: text('user_id').primaryKey(),
	userName: text('user_name').notNull().default('User'),
	userImageSrc: text('user_image_src').notNull().default('/mascot.svg'),
	activeCourseId: integer('active_course_id').references(() => courses.id, {
		onDelete: 'cascade',
	}),
	hearts: integer('hearts').notNull().default(5),
	points: integer('points').notNull().default(0),
})

export const userProgressRelations = relations(userProgress, ({ one }) => ({
	activeCourse: one(courses, {
		fields: [userProgress.activeCourseId],
		references: [courses.id],
	}),
}))

export const userSubscription = pgTable('user_subscription', {
	id: serial('id').primaryKey(),
	userId: text('user_id').notNull().unique(),
	stripeCustomerId: text('stripe_customer_id').notNull().unique(),
	stripeSubscriptionId: text('stripe_subscription_id').notNull().unique(),
	stripePriceId: text('stripe_price_id').notNull(),
	stripeCurrentPeriodEnd: timestamp('stripe_current_period_end').notNull(),
})

export const playLessons = pgTable('play_lessons', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(), // Lesson 1
	description: text('description').notNull(), // Practice the basics of Spanish
	courseId: integer('course_id')
		.references(() => courses.id, { onDelete: 'cascade' })
		.notNull(),
	order: integer('order').notNull(),
})

export const playLessonsRelations = relations(playLessons, ({ many, one }) => ({
	course: one(courses, {
		fields: [playLessons.courseId],
		references: [courses.id],
	}),
	games: many(games),
}))

export const games = pgTable('games', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	playLessonId: integer('play_lesson_id')
		.references(() => playLessons.id, { onDelete: 'cascade' })
		.notNull(),
	src: text('src').notNull(),
	order: integer('order').notNull(),
})

export const gamesRelations = relations(games, ({ one, many }) => ({
	playLesson: one(playLessons, {
		fields: [games.playLessonId],
		references: [playLessons.id],
	}),
}))

export const categories = pgTable('categories', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	courseId: integer('course_id')
		.references(() => courses.id, { onDelete: 'cascade' })
		.notNull(),
})

export const categoryRelations = relations(categories, ({ many }) => ({
	courses: many(courses),
	activities: many(activities),
}))

export const schedules = pgTable('schedules', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	courseId: integer('course_id')
		.references(() => courses.id, { onDelete: 'cascade' })
		.notNull(),
})

export const scheduleRelations = relations(schedules, ({ many }) => ({
	courses: many(courses),
	weeks: many(weeks),
}))

export const weeks = pgTable('weeks', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	scheduleId: integer('schedule_id')
		.references(() => schedules.id, { onDelete: 'cascade' })
		.notNull(),
})

export const weekRelations = relations(weeks, ({ many }) => ({
	schedules: many(schedules),
	days: many(days),
}))

export const days = pgTable('days', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	weekId: integer('week_id')
		.references(() => weeks.id, { onDelete: 'cascade' })
		.notNull(),
})

export const dayRelations = relations(days, ({ many }) => ({
	weeks: many(weeks),
	activities: many(activities),
}))

// export const lesson = pgTable('lesson', {
// 	id: serial('id').primaryKey(),
// 	title: text('title').notNull(),
// })
export const lessonsEnum = pgEnum('lesson', [
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'10',
	'11',
	'12',
	'13',
	'14',
	'15',
	'16',
	'17',
	'18',
	'19',
	'20',
])

// export const lessonRelations = relations(lesson, ({ many }) => ({
// 	activities: many(activities),
// }))

// export const types = pgTable('types', {
// 	id: serial('id').primaryKey(),
// 	title: text('title').notNull(),
// })

export const typesEnum = pgEnum('type', ['SELECT', 'ASSIST', 'HEAR'])

// export const typeRelations = relations(types, ({ many }) => ({
// 	activities: many(activities),
// }))

export const activities = pgTable('activities', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	lessonNumber: lessonsEnum('lesson').notNull(),
	type: typesEnum('types').notNull(),
	dayId: integer('day_id')
		.references(() => days.id, { onDelete: 'cascade' })
		.notNull(),
	categoryId: integer('category_id')
		.references(() => categories.id, { onDelete: 'cascade' })
		.notNull(),
})

export const activityRelations = relations(activities, ({ one, many }) => ({
	days: many(days),
	// lesson: one(lesson),
	// types: one(types),
	categories: one(categories),
	activityProgress: many(activityProgress),
}))

export const activityProgress = pgTable('activity_progress', {
	id: serial('id').primaryKey(),
	userId: text('user_id').notNull(),
	activityId: integer('activity_id')
		.references(() => activities.id, { onDelete: 'cascade' })
		.notNull(),
	completed: boolean('completed').notNull().default(false),
})

export const activityProgressRelations = relations(
	activityProgress,
	({ one }) => ({
		activity: one(activities, {
			fields: [activityProgress.activityId],
			references: [activities.id],
		}),
	})
)
