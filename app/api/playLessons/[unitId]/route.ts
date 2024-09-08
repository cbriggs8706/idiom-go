import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import db from '@/db/drizzle'
import { playLessons } from '@/db/schema'
import { isAdmin } from '@/lib/admin'

export const GET = async (
	req: Request,
	{ params }: { params: { playLessonId: number } }
) => {
	if (!isAdmin()) {
		return new NextResponse('Unauthorized', { status: 403 })
	}

	const data = await db.query.playLessons.findFirst({
		where: eq(playLessons.id, params.playLessonId),
	})

	return NextResponse.json(data)
}

export const PUT = async (
	req: Request,
	{ params }: { params: { playLessonId: number } }
) => {
	if (!isAdmin()) {
		return new NextResponse('Unauthorized', { status: 403 })
	}

	const body = await req.json()
	const data = await db
		.update(playLessons)
		.set({
			...body,
		})
		.where(eq(playLessons.id, params.playLessonId))
		.returning()

	return NextResponse.json(data[0])
}

export const DELETE = async (
	req: Request,
	{ params }: { params: { playLessonId: number } }
) => {
	if (!isAdmin()) {
		return new NextResponse('Unauthorized', { status: 403 })
	}

	const data = await db
		.delete(playLessons)
		.where(eq(playLessons.id, params.playLessonId))
		.returning()

	return NextResponse.json(data[0])
}
