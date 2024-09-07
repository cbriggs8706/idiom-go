import { redirect } from 'next/navigation'

import {
	getCourseProgress,
	getLessonPercentage,
	getUnits,
	getUserProgress,
	getUserSubscription,
} from '@/db/queries'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const PlayPage = async () => {
	const userProgressData = getUserProgress()
	const courseProgressData = getCourseProgress()
	const lessonPercentageData = getLessonPercentage()
	const unitsData = getUnits()
	const userSubscriptionData = getUserSubscription()

	const [
		userProgress,
		units,
		courseProgress,
		lessonPercentage,
		userSubscription,
	] = await Promise.all([
		userProgressData,
		unitsData,
		courseProgressData,
		lessonPercentageData,
		userSubscriptionData,
	])

	if (!userProgress || !userProgress.activeCourse) {
		redirect('/courses')
	}

	if (!courseProgress) {
		redirect('/courses')
	}

	const isPro = !!userSubscription?.isActive

	return (
		<div className="flex flex-col gap-[48px] px-6">
			<iframe
				style={{ maxWidth: '100%' }}
				src="https://wordwall.net/embed/464244aa0ec649af8d94f12500f6da0d?themeId=62&templateId=25&fontStackId=2"
				width="1000"
				height="760"
				allowFullScreen
			></iframe>
			<Link href="/play">
				<Button>End Game</Button>
			</Link>
		</div>
	)
}

export default PlayPage
