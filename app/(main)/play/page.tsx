import { redirect } from 'next/navigation'

// import { Promo } from '@/components/promo'
import { Quests } from '@/components/quests'
import { FeedWrapper } from '@/components/feed-wrapper'
import { UserProgress } from '@/components/user-progress'
import { StickyWrapper } from '@/components/sticky-wrapper'
import { lessons, units as unitsSchema } from '@/db/schema'
import {
	getCourseProgress,
	getLessonPercentage,
	getUnits,
	getUserProgress,
	getUserSubscription,
} from '@/db/queries'

import { Unit } from './unit'
import { Header } from './header'
import { UnitBanner } from '../learn/unit-banner'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

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
		<div className="flex flex-row-reverse gap-[48px] px-6">
			<StickyWrapper>
				<UserProgress
					activeCourse={userProgress.activeCourse}
					hearts={userProgress.hearts}
					points={userProgress.points}
					hasActiveSubscription={isPro}
				/>
				{/* {!isPro && (
          <Promo />
        )} */}
				<Quests points={userProgress.points} />
			</StickyWrapper>
			<FeedWrapper>
				<Header title={userProgress.activeCourse.title} />
				<div className="w-full rounded-xl bg-sky-500 p-5 text-white flex items-center justify-between">
					<div className="space-y-2.5">
						<h3 className="text-2xl font-bold">Lesson 6</h3>
					</div>
				</div>
				<div className="grid grid-cols-4 gap-4 mt-4">
					<Link href="/play/6/matching">
						<div className="flex flex-col items-center">
							<Image src="/gameIcons/matchingPairs.png" alt="Matching Pairs" />
							<span className="text-center">Matching Pairs</span>
						</div>
					</Link>
					<Link href="/play/6/unjumble col-span-1">
						<div className="flex flex-col items-center">
							<Image src="/gameIcons/unjumble.png" alt="Unjumble" />
							<span className="text-center">Unjumble</span>
						</div>
					</Link>
					<Link href="/play/6/spell col-span-1">
						<div className="flex flex-col items-center">
							<Image src="/gameIcons/spellWord.png" alt="Spell the Word" />
							<span className="text-center">Spell the Word</span>
						</div>
					</Link>
					<Link href="/play/6/wordsearch col-span-1">
						<div className="flex flex-col items-center">
							<Image src="/gameIcons/wordSearch.png" alt="Wordsearch" />
							<span className="text-center">Wordsearch</span>
						</div>
					</Link>
					<Link href="/play/6/whack col-span-1">
						<div className="flex flex-col items-center">
							<Image src="/gameIcons/whackMole.png" alt="Whack-a-mole" />
							<span className="text-center">Whack-a-mole</span>
						</div>
					</Link>
					<Link href="/play/6/balloon col-span-1">
						<div className="flex flex-col items-center">
							<Image src="/gameIcons/balloonPop.png" alt="Balloon Pop" />
							<span className="text-center">Balloon Pop</span>
						</div>
					</Link>
				</div>
			</FeedWrapper>
		</div>
	)
}

export default PlayPage
