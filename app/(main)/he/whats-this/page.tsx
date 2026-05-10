import Image from 'next/image'
import { FeedWrapper } from '@/components/feed-wrapper'
import HebrewWhatsThis from '@/components/hebrew/hebrew-whats-this'
import { DismissibleAlert } from '@/components/dismissible-alert'
import { getSession } from '@/lib/auth'
import { getCourseProgress, getUserProgress } from '@/db/queries'
import { getHebrewVocabByCourseId } from '@/lib/server/vocab'
import type { HebrewVocab } from '@/lib/vocab'

export default async function HebrewWhatsThisPage() {
	const session = await getSession()
	const userId = session?.user?.id ?? null

	const [userProgress, userChallengeData] = userId
		? await Promise.all([
				getUserProgress(),
				getCourseProgress(),
		  ])
		: [null, null]

	const activeCourseId = userProgress?.activeCourseId ?? 6
	const currentLesson = userChallengeData?.activeLesson?.lessonNumber ?? '1'
	const hebrewData: HebrewVocab[] = await getHebrewVocabByCourseId(activeCourseId)

	return (
		<div className="flex flex-row-reverse gap-[48px] px-6">
			<FeedWrapper>
				<div className="flex w-full flex-col items-center">
					<Image
						src="/gameIcons/quiz.png"
						alt="What's this?"
						height={90}
						width={90}
					/>

					<h1 className="my-6 text-center font-cardo text-6xl text-neutral-800">
						מַה־זֶּה
					</h1>
					<p className="mb-2 text-center font-bold text-neutral-800">
						What&apos;s this?
					</p>

					{!userId && (
						<p className="mb-3 italic text-gray-500">
							You&apos;re using guest mode — progress will not be saved.
						</p>
					)}

					<DismissibleAlert storageKey="whats-this" className="mb-4">
						Pick your lesson filter, ask only yes-or-no questions from the bank,
						then type your Hebrew guess. A yes answer repeats the statement in
						Hebrew, and a no answer is always לֹא.
					</DismissibleAlert>

					<HebrewWhatsThis
						data={hebrewData}
						currentLesson={currentLesson}
					/>
				</div>
			</FeedWrapper>
		</div>
	)
}
