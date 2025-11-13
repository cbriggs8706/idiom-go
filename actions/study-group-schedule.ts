'use server'

import { neonDb } from '@/db/neon/client'
import { studyGroupSchedule, studyGroupScheduleLessons } from '@/db/neon/schema'
import { eq } from 'drizzle-orm'

// Create or update a schedule session
export async function saveStudyGroupSession({
	studyGroupId,
	classDate,
	notes,
	homeworkInstructions,
	homeworkLinks,
	lessons,
	sessionId,
}: {
	studyGroupId: number
	classDate: string
	notes: string
	homeworkInstructions: string
	homeworkLinks: string[]
	lessons: number[]
	sessionId?: number | null
}) {
	if (sessionId) {
		// Update existing
		await neonDb
			.update(studyGroupSchedule)
			.set({
				classDate: new Date(classDate),
				notes,
				homeworkInstructions,
				homeworkLinks,
			})
			.where(eq(studyGroupSchedule.id, sessionId))

		// Reset lessons
		await neonDb
			.delete(studyGroupScheduleLessons)
			.where(eq(studyGroupScheduleLessons.scheduleId, sessionId))
		if (lessons.length) {
			await neonDb.insert(studyGroupScheduleLessons).values(
				lessons.map((lessonId) => ({
					scheduleId: sessionId,
					lessonId,
				}))
			)
		}
	} else {
		// Insert new
		const [session] = await neonDb
			.insert(studyGroupSchedule)
			.values({
				studyGroupId,
				classDate: new Date(classDate),
				notes,
				homeworkInstructions,
				homeworkLinks,
			})
			.returning({ id: studyGroupSchedule.id })

		if (lessons.length) {
			await neonDb.insert(studyGroupScheduleLessons).values(
				lessons.map((lessonId) => ({
					scheduleId: session.id,
					lessonId,
				}))
			)
		}
	}

	return { success: true }
}
