import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { neonDb } from '@/db/neon/client'
import { grammarLessons } from '@/db/neon/schema'
import { isAdmin } from '@/lib/admin'

export const GET = async (
	req: Request,
	{ params }: { params: Record<string, string> }
) => {
	const id = Number(params.grammarLessonId)
	if (isNaN(id)) {
		return new NextResponse('Invalid ID', { status: 400 })
	}

	if (!isAdmin()) {
		return new NextResponse('Unauthorized', { status: 403 })
	}

	const data = await neonDb.query.grammarLessons.findFirst({
		where: eq(grammarLessons.id, id),
	})

	return NextResponse.json(data)
}

export const PUT = async (
	req: Request,
	{ params }: { params: { grammarLessonId: number } }
) => {
	const id = Number(params.grammarLessonId)
	if (isNaN(id)) {
		return new NextResponse('Invalid ID', { status: 400 })
	}
	if (!isAdmin()) {
		return new NextResponse('Unauthorized', { status: 403 })
	}

	const body = await req.json()
	const data = await neonDb
		.update(grammarLessons)
		.set({
			...body,
		})
		.where(eq(grammarLessons.id, id))
		.returning()

	return NextResponse.json(data[0])
}

export const DELETE = async (
	req: Request,
	{ params }: { params: { grammarLessonId: number } }
) => {
	const id = Number(params.grammarLessonId)
	if (isNaN(id)) {
		return new NextResponse('Invalid ID', { status: 400 })
	}
	if (!isAdmin()) {
		return new NextResponse('Unauthorized', { status: 403 })
	}

	const data = await neonDb
		.delete(grammarLessons)
		.where(eq(grammarLessons.id, id))
		.returning()

	return NextResponse.json(data[0])
}
