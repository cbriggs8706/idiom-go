import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { neonDb } from '@/db/neon/client'
import { lessons } from '@/db/neon/schema'
import { isAdmin } from '@/lib/admin'

export const GET = async (
	req: Request,
	{ params }: { params: Record<string, string> }
) => {
	if (!isAdmin()) {
		return new NextResponse('Unauthorized', { status: 403 })
	}
	const id = Number(params.lessonId)
	const data = await neonDb.query.lessons.findFirst({
		where: eq(lessons.id, id),
	})

	return NextResponse.json(data)
}

export const PUT = async (
	req: Request,
	{ params }: { params: { lessonId: string } }
) => {
	console.log('API Method:', req.method)
	console.log('Matched dynamic route:', params.lessonId, req.method)

	if (!isAdmin()) {
		return new NextResponse('Unauthorized', { status: 403 })
	}
	const id = Number(params.lessonId)
	const body = await req.json()
	const data = await neonDb
		.update(lessons)
		.set({
			...body,
		})
		.where(eq(lessons.id, id))
		.returning()

	return NextResponse.json(data[0])
}

export const DELETE = async (
	req: Request,
	{ params }: { params: { lessonId: string } }
) => {
	if (!isAdmin()) {
		return new NextResponse('Unauthorized', { status: 403 })
	}
	const id = Number(params.lessonId)
	const data = await neonDb
		.delete(lessons)
		.where(eq(lessons.id, id))
		.returning()

	return NextResponse.json(data[0])
}
