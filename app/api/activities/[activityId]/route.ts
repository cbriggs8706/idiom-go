// import { eq } from 'drizzle-orm'
// import { NextResponse } from 'next/server'

// import db from '@/db/drizzle'
// import { activities } from '@/db/schema'
// import { isAdmin } from '@/lib/admin'

// export const GET = async (
// 	req: Request,
// 	{ params }: { params: { activityId: number } }
// ) => {
// 	if (!isAdmin()) {
// 		return new NextResponse('Unauthorized', { status: 403 })
// 	}

// 	const data = await db.query.activities.findFirst({
// 		where: eq(activities.id, params.activityId),
// 	})

// 	return NextResponse.json(data)
// }

// export const PUT = async (
// 	req: Request,
// 	{ params }: { params: { activityId: number } }
// ) => {
// 	if (!isAdmin()) {
// 		return new NextResponse('Unauthorized', { status: 403 })
// 	}

// 	const body = await req.json()
// 	const data = await db
// 		.update(activities)
// 		.set({
// 			...body,
// 		})
// 		.where(eq(activities.id, params.activityId))
// 		.returning()

// 	return NextResponse.json(data[0])
// }

// export const DELETE = async (
// 	req: Request,
// 	{ params }: { params: { activityId: number } }
// ) => {
// 	if (!isAdmin()) {
// 		return new NextResponse('Unauthorized', { status: 403 })
// 	}

// 	const data = await db
// 		.delete(activities)
// 		.where(eq(activities.id, params.activityId))
// 		.returning()

// 	return NextResponse.json(data[0])
// }
