import { cache } from 'react'
import { eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs'

import db from '@/db/drizzle'
import {
	challengeProgress,
	courses,
	lessons,
	units,
	userProgress,
	userSubscription,
} from '@/db/schema'

export const getUserProgress = cache(async () => {
	const { userId } = await auth()

	if (!userId) {
		return null
	}

	const data = await db.query.userProgress.findFirst({
		where: eq(userProgress.userId, userId),
		with: {
			activeCourse: true,
		},
	})

	return data
})

export const getUnits = cache(async () => {
	const { userId } = await auth()
	const userProgress = await getUserProgress()

	if (!userId || !userProgress?.activeCourseId) {
		return []
	}

	const data = await db.query.units.findMany({
		orderBy: (units, { asc }) => [asc(units.order)],
		where: eq(units.courseId, userProgress.activeCourseId),
		with: {
			lessons: {
				orderBy: (lessons, { asc }) => [asc(lessons.order)],
				with: {
					challenges: {
						orderBy: (challenges, { asc }) => [asc(challenges.order)],
						with: {
							challengeProgress: {
								where: eq(challengeProgress.userId, userId),
							},
						},
					},
				},
			},
		},
	})

	const normalizedData = data.map((unit) => {
		const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
			if (lesson.challenges.length === 0) {
				return { ...lesson, completed: false }
			}

			const allCompletedChallenges = lesson.challenges.every((challenge) => {
				return (
					challenge.challengeProgress &&
					challenge.challengeProgress.length > 0 &&
					challenge.challengeProgress.every((progress) => progress.completed)
				)
			})

			return { ...lesson, completed: allCompletedChallenges }
		})

		return { ...unit, lessons: lessonsWithCompletedStatus }
	})

	return normalizedData
})

export const getCourses = cache(async () => {
	const data = await db.query.courses.findMany()

	return data
})

export const getCourseById = cache(async (courseId: number) => {
	const data = await db.query.courses.findFirst({
		where: eq(courses.id, courseId),
		with: {
			units: {
				orderBy: (units, { asc }) => [asc(units.order)],
				with: {
					lessons: {
						orderBy: (lessons, { asc }) => [asc(lessons.order)],
					},
				},
			},
		},
	})

	return data
})

export const getCourseProgress = cache(async () => {
	const { userId } = await auth()
	const userProgress = await getUserProgress()

	if (!userId || !userProgress?.activeCourseId) {
		return null
	}

	const unitsInActiveCourse = await db.query.units.findMany({
		orderBy: (units, { asc }) => [asc(units.order)],
		where: eq(units.courseId, userProgress.activeCourseId),
		with: {
			lessons: {
				orderBy: (lessons, { asc }) => [asc(lessons.order)],
				with: {
					unit: true,
					challenges: {
						with: {
							challengeProgress: {
								where: eq(challengeProgress.userId, userId),
							},
						},
					},
				},
			},
		},
	})

	const firstUncompletedLesson = unitsInActiveCourse
		.flatMap((unit) => unit.lessons)
		.find((lesson) => {
			return lesson.challenges.some((challenge) => {
				return (
					!challenge.challengeProgress ||
					challenge.challengeProgress.length === 0 ||
					challenge.challengeProgress.some(
						(progress) => progress.completed === false
					)
				)
			})
		})

	return {
		activeLesson: firstUncompletedLesson,
		activeLessonId: firstUncompletedLesson?.id,
	}
})

export const getLesson = cache(async (id?: number) => {
	const { userId } = await auth()

	if (!userId) {
		return null
	}

	const courseProgress = await getCourseProgress()

	const lessonId = id || courseProgress?.activeLessonId

	if (!lessonId) {
		return null
	}

	const data = await db.query.lessons.findFirst({
		where: eq(lessons.id, lessonId),
		with: {
			challenges: {
				orderBy: (challenges, { asc }) => [asc(challenges.order)],
				with: {
					challengeOptions: true,
					challengeProgress: {
						where: eq(challengeProgress.userId, userId),
					},
				},
			},
		},
	})

	if (!data || !data.challenges) {
		return null
	}

	const normalizedChallenges = data.challenges.map((challenge) => {
		const completed =
			challenge.challengeProgress &&
			challenge.challengeProgress.length > 0 &&
			challenge.challengeProgress.every((progress) => progress.completed)

		return { ...challenge, completed }
	})

	return { ...data, challenges: normalizedChallenges }
})

export const getLessonPercentage = cache(async () => {
	const courseProgress = await getCourseProgress()

	if (!courseProgress?.activeLessonId) {
		return 0
	}

	const lesson = await getLesson(courseProgress.activeLessonId)

	if (!lesson) {
		return 0
	}

	const completedChallenges = lesson.challenges.filter(
		(challenge) => challenge.completed
	)
	const percentage = Math.round(
		(completedChallenges.length / lesson.challenges.length) * 100
	)

	return percentage
})

const DAY_IN_MS = 86_400_000
export const getUserSubscription = cache(async () => {
	const { userId } = await auth()

	if (!userId) return null

	const data = await db.query.userSubscription.findFirst({
		where: eq(userSubscription.userId, userId),
	})

	if (!data) return null

	const isActive =
		data.stripePriceId &&
		data.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()

	return {
		...data,
		isActive: !!isActive,
	}
})

export const getTopTenUsers = cache(async () => {
	const { userId } = await auth()

	if (!userId) {
		return []
	}

	const data = await db.query.userProgress.findMany({
		orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
		limit: 10,
		columns: {
			userId: true,
			userName: true,
			userImageSrc: true,
			points: true,
		},
	})

	return data
})

// import { cache } from 'react'
// import { eq } from 'drizzle-orm'
// import { auth } from '@clerk/nextjs'

// import db from '@/db/drizzle'
// import {
// 	activities,
// 	days,
// 	activityProgress,
// 	challengeProgress,
// 	courses,
// 	lessons,
// 	schedules,
// 	units,
// 	userProgress,
// 	userSubscription,
// } from '@/db/schema'

// export const getUserProgress = cache(async () => {
// 	const { userId } = await auth()

// 	if (!userId) {
// 		return null
// 	}

// 	const data = await db.query.userProgress.findFirst({
// 		where: eq(userProgress.userId, userId),
// 		with: {
// 			activeCourse: true,
// 		},
// 	})

// 	return data
// })

// export const getUnits = cache(async () => {
// 	const { userId } = await auth()
// 	const userProgress = await getUserProgress()

// 	if (!userId || !userProgress?.activeCourseId) {
// 		return []
// 	}

// 	const data = await db.query.units.findMany({
// 		orderBy: (units, { asc }) => [asc(units.order)],
// 		where: eq(units.courseId, userProgress.activeCourseId),
// 		with: {
// 			lessons: {
// 				orderBy: (lessons, { asc }) => [asc(lessons.order)],
// 				with: {
// 					challenges: {
// 						orderBy: (challenges, { asc }) => [asc(challenges.order)],
// 						with: {
// 							challengeProgress: {
// 								where: eq(challengeProgress.userId, userId),
// 							},
// 						},
// 					},
// 				},
// 			},
// 		},
// 	})

// 	const normalizedData = data.map((unit) => {
// 		const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
// 			if (lesson.challenges.length === 0) {
// 				return { ...lesson, completed: false }
// 			}

// 			const allCompletedChallenges = lesson.challenges.every((challenge) => {
// 				return (
// 					challenge.challengeProgress &&
// 					challenge.challengeProgress.length > 0 &&
// 					challenge.challengeProgress.every((progress) => progress.completed)
// 				)
// 			})

// 			return { ...lesson, completed: allCompletedChallenges }
// 		})

// 		return { ...unit, lessons: lessonsWithCompletedStatus }
// 	})

// 	return normalizedData
// })

// export const getCourses = cache(async () => {
// 	const data = await db.query.courses.findMany()

// 	return data
// })

// export const getCourseById = cache(async (courseId: number) => {
// 	const data = await db.query.courses.findFirst({
// 		where: eq(courses.id, courseId),
// 		with: {
// 			units: {
// 				orderBy: (units, { asc }) => [asc(units.order)],
// 				with: {
// 					lessons: {
// 						orderBy: (lessons, { asc }) => [asc(lessons.order)],
// 					},
// 				},
// 			},
// 		},
// 	})

// 	return data
// })

// export const getCourseProgress = cache(async () => {
// 	const { userId } = await auth()
// 	const userProgress = await getUserProgress()

// 	if (!userId || !userProgress?.activeCourseId) {
// 		return null
// 	}

// 	const schedulesInActiveCourse = await db.query.schedules.findMany({
// 		orderBy: (schedules, { asc }) => [asc(schedules.title)],
// 		where: eq(schedules.courseId, userProgress.activeCourseId),
// 		with: {
// 			weeks: {
// 				orderBy: (weeks, { asc }) => [asc(weeks.title)],
// 				with: {
// 					days: {
// 						orderBy: (days, { asc }) => [asc(days.title)],
// 						with: {
// 							weeks: true,
// 							activities: {
// 								with: {
// 									activityProgress: {
// 										where: eq(activityProgress.userId, userId),
// 									},
// 								},
// 							},
// 						},
// 					},
// 				},
// 			},
// 		},
// 	})

// 	const unitsInActiveCourse = await db.query.units.findMany({
// 		orderBy: (units, { asc }) => [asc(units.order)],
// 		where: eq(units.courseId, userProgress.activeCourseId),
// 		with: {
// 			lessons: {
// 				orderBy: (lessons, { asc }) => [asc(lessons.order)],
// 				with: {
// 					unit: true,
// 					challenges: {
// 						with: {
// 							challengeProgress: {
// 								where: eq(challengeProgress.userId, userId),
// 							},
// 						},
// 					},
// 				},
// 			},
// 		},
// 	})

// 	const firstUncompletedLesson = unitsInActiveCourse
// 		.flatMap((unit) => unit.lessons)
// 		.find((lesson) => {
// 			return lesson.challenges.some((challenge) => {
// 				return (
// 					!challenge.challengeProgress ||
// 					challenge.challengeProgress.length === 0 ||
// 					challenge.challengeProgress.some(
// 						(progress) => progress.completed === false
// 					)
// 				)
// 			})
// 		})

// 	const firstUncompletedDay = schedulesInActiveCourse
// 		.flatMap((schedule) => schedule.weeks.flatMap((week) => week.days))
// 		.find((day) => {
// 			return day.activities.some((activity) => {
// 				return (
// 					!activity.activityProgress ||
// 					activity.activityProgress.length === 0 ||
// 					activity.activityProgress.some(
// 						(progress) => progress.completed === false
// 					)
// 				)
// 			})
// 		})

// 	return {
// 		activeDay: firstUncompletedDay,
// 		activeDayId: firstUncompletedDay?.id,
// 		activeLesson: firstUncompletedLesson,
// 		activeLessonId: firstUncompletedLesson?.id,
// 	}
// })

// export const getLesson = cache(async (id?: number) => {
// 	const { userId } = await auth()

// 	if (!userId) {
// 		return null
// 	}

// 	const courseProgress = await getCourseProgress()

// 	const lessonId = id || courseProgress?.activeLessonId

// 	if (!lessonId) {
// 		return null
// 	}

// 	const data = await db.query.lessons.findFirst({
// 		where: eq(lessons.id, lessonId),
// 		with: {
// 			challenges: {
// 				orderBy: (challenges, { asc }) => [asc(challenges.order)],
// 				with: {
// 					challengeOptions: true,
// 					challengeProgress: {
// 						where: eq(challengeProgress.userId, userId),
// 					},
// 				},
// 			},
// 		},
// 	})

// 	if (!data || !data.challenges) {
// 		return null
// 	}

// 	const normalizedChallenges = data.challenges.map((challenge) => {
// 		const completed =
// 			challenge.challengeProgress &&
// 			challenge.challengeProgress.length > 0 &&
// 			challenge.challengeProgress.every((progress) => progress.completed)

// 		return { ...challenge, completed }
// 	})

// 	return { ...data, challenges: normalizedChallenges }
// })

// //

// export const getDay = cache(async (id?: number) => {
// 	const { userId } = await auth()

// 	if (!userId) {
// 		return null
// 	}

// 	const courseProgress = await getCourseProgress()

// 	const dayId = id || courseProgress?.activeDayId

// 	if (!dayId) {
// 		return null
// 	}

// 	const data = await db.query.days.findFirst({
// 		where: eq(days.id, dayId),
// 		with: {
// 			activities: {
// 				orderBy: (activities, { asc }) => [asc(activities.title)],
// 				with: {
// 					activityProgress: {
// 						where: eq(activityProgress.userId, userId),
// 					},
// 				},
// 			},
// 		},
// 	})

// 	if (!data || !data.activities) {
// 		return null
// 	}

// 	const normalizedActivities = data.activities.map((activity) => {
// 		const completed =
// 			activity.activityProgress &&
// 			activity.activityProgress.length > 0 &&
// 			activity.activityProgress.every((progress) => progress.completed)

// 		return { ...activity, completed }
// 	})

// 	return { ...data, activities: normalizedActivities }
// })

// export const getGame = cache(async (id?: number) => {
// 	const { userId } = await auth()

// 	if (!userId) {
// 		return null
// 	}

// 	const courseProgress = await getCourseProgress()

// 	const gameId = id || courseProgress?.activeLessonId

// 	if (!gameId) {
// 		return null
// 	}

// 	const data = await db.query.games.findFirst({
// 		where: eq(games.id, gameId),
// 	})

// 	return data
// })

// export const getDayPercentage = cache(async () => {
// 	const courseProgress = await getCourseProgress()

// 	if (!courseProgress?.activeDayId) {
// 		return 0
// 	}

// 	const day = await getDay(courseProgress.activeDayId)

// 	if (!day) {
// 		return 0
// 	}

// 	const completedActivities = day.activities.filter(
// 		(activity) => activity.completed
// 	)
// 	const percentage = Math.round(
// 		(completedActivities.length / day.activities.length) * 100
// 	)

// 	return percentage
// })
// export const getLessonPercentage = cache(async () => {
// 	const courseProgress = await getCourseProgress()

// 	if (!courseProgress?.activeLessonId) {
// 		return 0
// 	}

// 	const lesson = await getLesson(courseProgress.activeLessonId)

// 	if (!lesson) {
// 		return 0
// 	}

// 	const completedChallenges = lesson.challenges.filter(
// 		(challenge) => challenge.completed
// 	)
// 	const percentage = Math.round(
// 		(completedChallenges.length / lesson.challenges.length) * 100
// 	)

// 	return percentage
// })

// const DAY_IN_MS = 86_400_000
// export const getUserSubscription = cache(async () => {
// 	const { userId } = await auth()

// 	if (!userId) return null

// 	const data = await db.query.userSubscription.findFirst({
// 		where: eq(userSubscription.userId, userId),
// 	})

// 	if (!data) return null

// 	const isActive =
// 		data.stripePriceId &&
// 		data.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()

// 	return {
// 		...data,
// 		isActive: !!isActive,
// 	}
// })

// export const getTopTenUsers = cache(async () => {
// 	const { userId } = await auth()

// 	if (!userId) {
// 		return []
// 	}

// 	const data = await db.query.userProgress.findMany({
// 		orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
// 		limit: 10,
// 		columns: {
// 			userId: true,
// 			userName: true,
// 			userImageSrc: true,
// 			points: true,
// 		},
// 	})

// 	return data
// })

// //

// export const getSchedules = cache(async () => {
// 	const { userId } = await auth()
// 	const userProgress = await getUserProgress()

// 	if (!userId || !userProgress?.activeCourseId) {
// 		return []
// 	}

// 	const data = await db.query.schedules.findMany({
// 		orderBy: (schedules, { asc }) => [asc(schedules.title)],
// 		where: eq(schedules.courseId, userProgress.activeCourseId),
// 		with: {
// 			weeks: {
// 				orderBy: (weeks, { asc }) => [asc(weeks.title)],
// 				with: {
// 					days: {
// 						orderBy: (days, { asc }) => [asc(days.title)],
// 						with: {
// 							activities: {
// 								orderBy: (activities, { asc }) => [asc(activities.title)],
// 								with: {
// 									activityProgress: {
// 										where: eq(activityProgress.userId, userId),
// 									},
// 								},
// 							},
// 						},
// 					},
// 				},
// 			},
// 		},
// 	})

// 	const normalizedData = data.map((schedule) => {
// 		const weeksWithCompletedStatus = schedule.weeks.map((week) => {
// 			const daysWithCompletedStatus = week.days.map((day) => {
// 				if (day.activities.length === 0) {
// 					return { ...day, completed: false }
// 				}

// 				const allCompletedActivities = day.activities.every((activity) => {
// 					return (
// 						activity.activityProgress &&
// 						activity.activityProgress.length > 0 &&
// 						activity.activityProgress.every((progress) => progress.completed)
// 					)
// 				})

// 				return { ...day, completed: allCompletedActivities }
// 			})

// 			const allCompletedDays = daysWithCompletedStatus.every(
// 				(day) => day.completed
// 			)
// 			return {
// 				...week,
// 				days: daysWithCompletedStatus,
// 				completed: allCompletedDays,
// 			}
// 		})

// 		return { ...schedule, weeks: weeksWithCompletedStatus }
// 	})
// 	console.log(normalizedData)
// 	return normalizedData
// })
