import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import db from '@/db/drizzle'
import { weeks } from '@/db/schema'
import { isAdmin } from '@/lib/admin'

export const GET = async (
	req: Request,
	{ params }: { params: { weekId: number } }
) => {
	if (!isAdmin()) {
		return new NextResponse('Unauthorized', { status: 403 })
	}

	const data = await db.query.weeks.findFirst({
		where: eq(weeks.id, params.weekId),
	})

	return NextResponse.json(data)
}

export const PUT = async (
	req: Request,
	{ params }: { params: { weekId: number } }
) => {
	if (!isAdmin()) {
		return new NextResponse('Unauthorized', { status: 403 })
	}

	const body = await req.json()
	const data = await db
		.update(weeks)
		.set({
			...body,
		})
		.where(eq(weeks.id, params.weekId))
		.returning()

	return NextResponse.json(data[0])
}

export const DELETE = async (
	req: Request,
	{ params }: { params: { weekId: number } }
) => {
	if (!isAdmin()) {
		return new NextResponse('Unauthorized', { status: 403 })
	}

	const data = await db
		.delete(weeks)
		.where(eq(weeks.id, params.weekId))
		.returning()

	return NextResponse.json(data[0])
}
