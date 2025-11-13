import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { neonDb } from '@/db/neon/client'
import { englishLessonScripts } from '@/db/neon/schema'
import { isAdmin } from '@/lib/admin'

export const GET = async (
	req: Request,
	{ params }: { params: Record<string, string> }
) => {
	const id = Number(params.lessonScriptId)
	if (isNaN(id)) {
		return new NextResponse('Invalid ID', { status: 400 })
	}

	if (!isAdmin()) {
		return new NextResponse('Unauthorized', { status: 403 })
	}

	const data = await neonDb.query.englishLessonScripts.findFirst({
		where: eq(englishLessonScripts.id, id),
	})

	return NextResponse.json(data)
}

export const PUT = async (
	req: Request,
	{ params }: { params: { lessonScriptId: number } }
) => {
	const id = Number(params.lessonScriptId)
	if (isNaN(id)) {
		return new NextResponse('Invalid ID', { status: 400 })
	}
	if (!isAdmin()) {
		return new NextResponse('Unauthorized', { status: 403 })
	}

	const body = await req.json()
	const data = await neonDb
		.update(englishLessonScripts)
		.set({
			...body,
		})
		.where(eq(englishLessonScripts.id, id))
		.returning()

	return NextResponse.json(data[0])
}

export const DELETE = async (
	req: Request,
	{ params }: { params: { lessonScriptId: number } }
) => {
	const id = Number(params.lessonScriptId)
	if (isNaN(id)) {
		return new NextResponse('Invalid ID', { status: 400 })
	}
	if (!isAdmin()) {
		return new NextResponse('Unauthorized', { status: 403 })
	}

	const data = await neonDb
		.delete(englishLessonScripts)
		.where(eq(englishLessonScripts.id, id))
		.returning()

	return NextResponse.json(data[0])
}
