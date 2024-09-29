import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import db from '@/db/drizzle'
import { days } from '@/db/schema'
import { isAdmin } from '@/lib/admin'

export const GET = async (
	req: Request,
	{ params }: { params: { dayId: number } }
) => {
	if (!isAdmin()) {
		return new NextResponse('Unauthorized', { status: 403 })
	}

	const data = await db.query.days.findFirst({
		where: eq(days.id, params.dayId),
	})

	return NextResponse.json(data)
}

export const PUT = async (
	req: Request,
	{ params }: { params: { dayId: number } }
) => {
	if (!isAdmin()) {
		return new NextResponse('Unauthorized', { status: 403 })
	}

	const body = await req.json()
	const data = await db
		.update(days)
		.set({
			...body,
		})
		.where(eq(days.id, params.dayId))
		.returning()

	return NextResponse.json(data[0])
}

export const DELETE = async (
	req: Request,
	{ params }: { params: { dayId: number } }
) => {
	if (!isAdmin()) {
		return new NextResponse('Unauthorized', { status: 403 })
	}

	const data = await db
		.delete(days)
		.where(eq(days.id, params.dayId))
		.returning()

	return NextResponse.json(data[0])
}
