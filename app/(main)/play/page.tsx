import { redirect } from 'next/navigation'

import { FeedWrapper } from '@/components/feed-wrapper'
import { UserProgress } from '@/components/user-progress'
import { StickyWrapper } from '@/components/sticky-wrapper'
import { games, playLessons as playLessonsSchema } from '@/db/schema'
import {
	getCourseProgress,
	getPlayLessons,
	getUserProgress,
	getUserSubscription,
} from '@/db/queries'

import { PlayLesson } from './play-lesson'
import { Header } from './header'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar } from '@/components/ui/calendar'

const PlayPage = async () => {
	const userProgressData = getUserProgress()
	const courseProgressData = getCourseProgress()
	const playLessonsData = getPlayLessons()
	const userSubscriptionData = getUserSubscription()

	const [userProgress, playLessons, courseProgress, userSubscription] =
		await Promise.all([
			userProgressData,
			playLessonsData,
			courseProgressData,
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
				<Calendar />
			</StickyWrapper>
			<FeedWrapper>
				<Header title={userProgress.activeCourse.title} />
				{playLessons.map((playLesson) => (
					<div key={playLesson.id} className="mb-10">
						{/* <PlayLesson
							id={playLesson.id}
							order={playLesson.order}
							description={playLesson.description}
							title={playLesson.title}
							games={playLesson.games}
						/> */}
					</div>
				))}
				<div className="w-full rounded-xl bg-sky-500 p-5 text-white flex items-center justify-between">
					<div className="space-y-2.5">
						<h3 className="text-2xl font-bold">Lesson 6</h3>
					</div>
				</div>
				<h2 className="my-6 font-bold text-xl">Beginner</h2>
				<div className="grid grid-cols-4 gap-4 mt-4">
					<Link href="/play/6/matchup">
						<div className="flex flex-col items-center">
							<Image
								src="/gameIcons/matchUp.png"
								alt="Match Up"
								width="550"
								height="550"
							/>
							<span className="text-center">Match Up</span>
						</div>
					</Link>
					<Link href="/play/6/unscramble">
						<div className="flex flex-col items-center">
							<Image
								src="/gameIcons/unscramble.png"
								alt="Unscramble"
								width="550"
								height="550"
							/>
							<span className="text-center">Unscramble</span>
						</div>
					</Link>
				</div>
				<h2 className="my-6 font-bold text-xl">Intermediate</h2>
				<div className="grid grid-cols-4 gap-4 mt-4">
					<Link href="/play/6/matching">
						<div className="flex flex-col items-center">
							<Image
								src="/gameIcons/matchingPairs.png"
								alt="Matching Pairs"
								width="550"
								height="550"
							/>
							<span className="text-center">Matching Pairs</span>
						</div>
					</Link>
					<Link href="/play/6/spellword">
						<div className="flex flex-col items-center">
							<Image
								src="/gameIcons/spellWord.png"
								alt="Spell the Word"
								width="550"
								height="550"
							/>
							<span className="text-center">Spell the Word</span>
						</div>
					</Link>
				</div>
				<h2 className="my-6 font-bold text-xl">Advanced</h2>
				<div className="grid grid-cols-4 gap-4 mt-4">
					<Link href="/play/6/anagram">
						<div className="flex flex-col items-center">
							<Image
								src="/gameIcons/anagram.png"
								alt="Anagram"
								width="550"
								height="550"
							/>
							<span className="text-center">Anagram</span>
						</div>
					</Link>
				</div>
			</FeedWrapper>
		</div>
	)
}

export default PlayPage
