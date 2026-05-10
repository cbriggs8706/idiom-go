'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import LessonFilter from '@/components/filters/filter-lesson'
import HebrewKeyboard from '@/components/hebrew/hebrew-keyboard'
import { useLessonCards } from '@/hooks/useLessonCards'
import {
	buildHebrewGuessCandidate,
	HEBREW_WHATS_THIS_QUESTIONS,
	normalizeHebrewConsonants,
	normalizeHebrewPointed,
	type HebrewGuessCandidate,
} from '@/lib/hebrew-whats-this'
import type { HebrewVocab } from '@/lib/vocab'

type GradingMode = 'consonants-only' | 'consonants-and-vowels'

type AskedQuestion = {
	key: string
	question: string
	response: string
	answer: boolean
}

interface HebrewWhatsThisProps {
	data: HebrewVocab[]
	currentLesson: string
}

function chooseRandomCandidate(candidates: HebrewGuessCandidate[]) {
	return candidates[Math.floor(Math.random() * candidates.length)] ?? null
}

function matchesAskedQuestions(
	candidate: HebrewGuessCandidate,
	askedQuestions: AskedQuestion[],
) {
	return askedQuestions.every((asked) => {
		const question = HEBREW_WHATS_THIS_QUESTIONS.find(
			(item) => item.key === asked.key,
		)
		if (!question) return true
		return question.match(candidate) === asked.answer
	})
}

export default function HebrewWhatsThis({
	data,
	currentLesson,
}: HebrewWhatsThisProps) {
	const {
		selectedLessons,
		setSelectedLessons,
	} = useLessonCards(data, currentLesson)

	const inputRef = useRef<HTMLInputElement | null>(null)
	const [gradingMode, setGradingMode] =
		useState<GradingMode>('consonants-only')
	const [askedQuestions, setAskedQuestions] = useState<AskedQuestion[]>([])
	const [guess, setGuess] = useState('')
	const [guessFeedback, setGuessFeedback] = useState<null | 'correct' | 'incorrect'>(
		null,
	)
	const [targetKey, setTargetKey] = useState<string | null>(null)

	const filterableCards = useMemo(() => {
		const allowedCategories = new Set(['noun', 'number', 'name', 'letter'])

		return data.filter((card) => {
			const category = String(card.category ?? '').toLowerCase()
			return (
				allowedCategories.has(category) &&
				!card.lessons.some((lesson) =>
					String(lesson).toLowerCase().includes('classroom'),
				) &&
				Boolean(card.heb?.trim())
			)
		})
	}, [data])

	const eligibleCards = useMemo(() => {
		return filterableCards.filter((card) => {
			return (
				selectedLessons.length === 0 ||
				card.lessons.some((lesson) => selectedLessons.includes(lesson))
			)
		})
	}, [filterableCards, selectedLessons])

	const candidates = useMemo(
		() => eligibleCards.map((card) => buildHebrewGuessCandidate(card)),
		[eligibleCards],
	)

	const targetCandidate = useMemo(() => {
		return candidates.find((candidate) => candidate.key === targetKey) ?? null
	}, [candidates, targetKey])

	useEffect(() => {
		if (!targetCandidate) return

		console.log('What\'s this target word:', {
			heb: targetCandidate.card.heb,
			hebNiqqud: targetCandidate.card.hebNiqqud,
			eng: targetCandidate.card.eng,
			lessons: targetCandidate.card.lessons,
			facts: targetCandidate.facts,
		})
	}, [targetCandidate])

	const remainingCandidates = useMemo(() => {
		return candidates.filter((candidate) =>
			matchesAskedQuestions(candidate, askedQuestions),
		)
	}, [askedQuestions, candidates])

	useEffect(() => {
		if (candidates.length === 0) {
			setTargetKey(null)
			setAskedQuestions([])
			setGuess('')
			setGuessFeedback(null)
			return
		}

		const nextTarget = chooseRandomCandidate(candidates)
		setTargetKey(nextTarget?.key ?? null)
		setAskedQuestions([])
		setGuess('')
		setGuessFeedback(null)
	}, [candidates])

	useEffect(() => {
		inputRef.current?.focus()
	}, [targetKey, gradingMode])

	const visibleQuestions = useMemo(() => {
		const askedKeys = new Set(askedQuestions.map((question) => question.key))

		return HEBREW_WHATS_THIS_QUESTIONS.filter((question) => {
			if (askedKeys.has(question.key)) return false

			let yesCount = 0
			let noCount = 0
			for (const candidate of remainingCandidates) {
				if (question.match(candidate)) {
					yesCount += 1
				} else {
					noCount += 1
				}

				if (yesCount > 0 && noCount > 0) {
					return true
				}
			}

			return false
		})
	}, [askedQuestions, remainingCandidates])

	function startNewRound() {
		if (candidates.length === 0) return

		const pool = remainingCandidates.length > 1 ? remainingCandidates : candidates
		const nextTarget = chooseRandomCandidate(pool)
		setTargetKey(nextTarget?.key ?? null)
		setAskedQuestions([])
		setGuess('')
		setGuessFeedback(null)
	}

	function handleQuestionClick(questionKey: string) {
		if (!targetCandidate) return

		const question = HEBREW_WHATS_THIS_QUESTIONS.find(
			(item) => item.key === questionKey,
		)
		if (!question) return

		const answer = question.match(targetCandidate)

		setAskedQuestions((current) => [
			...current,
			{
				key: question.key,
				question: question.question,
				response: answer ? question.affirmative : 'לֹא',
				answer,
			},
		])
		setGuessFeedback(null)
	}

	function handleGuessSubmit() {
		if (!targetCandidate) return

		const expected =
			gradingMode === 'consonants-and-vowels'
				? targetCandidate.card.hebNiqqud?.trim() || targetCandidate.card.heb.trim()
				: targetCandidate.card.heb.trim()

		const cleanedGuess =
			gradingMode === 'consonants-and-vowels'
				? normalizeHebrewPointed(guess.trim())
				: normalizeHebrewConsonants(guess.trim())
		const cleanedExpected =
			gradingMode === 'consonants-and-vowels'
				? normalizeHebrewPointed(expected)
				: normalizeHebrewConsonants(expected)

		const isCorrect = cleanedGuess.length > 0 && cleanedGuess === cleanedExpected
		setGuessFeedback(isCorrect ? 'correct' : 'incorrect')
	}

	function updateGuessFromKeyboard(key: string) {
		const input = inputRef.current
		if (!input) return

		const start = input.selectionStart ?? input.value.length
		const end = input.selectionEnd ?? input.value.length
		let nextValue = guess
		let nextCaret = start

		if (key === '\b') {
			if (start === end && start > 0) {
				nextValue = guess.slice(0, start - 1) + guess.slice(end)
				nextCaret = start - 1
			} else {
				nextValue = guess.slice(0, start) + guess.slice(end)
				nextCaret = start
			}
		} else {
			nextValue = guess.slice(0, start) + key + guess.slice(end)
			nextCaret = start + key.length
		}

		setGuess(nextValue)

		requestAnimationFrame(() => {
			input.focus()
			input.setSelectionRange(nextCaret, nextCaret)
		})
	}

	const emptyStateMessage =
		data.length > 0
			? 'No eligible answers match these lessons yet. This activity only uses entries tagged as noun, number, name, or letter.'
			: 'No Hebrew vocab was loaded for this course.'

	return (
		<div className="w-full max-w-6xl">
			<div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-center shadow-sm">
				<p className="font-cardo text-2xl text-neutral-800">מַה־זֶּה</p>
				<p className="mt-2 text-sm text-neutral-700">
					Choose your lessons, ask only yes-or-no questions, then guess the
					Hebrew answer.
				</p>
			</div>

			<LessonFilter
				data={filterableCards}
				selectedLessons={selectedLessons}
				setSelectedLessons={setSelectedLessons}
			/>

			<div className="mb-6 flex flex-wrap items-center justify-center gap-3">
				{(['consonants-only', 'consonants-and-vowels'] as GradingMode[]).map(
					(mode) => (
						<button
							key={mode}
							onClick={() => setGradingMode(mode)}
							className={`rounded-full border px-4 py-2 text-sm font-medium ${
								gradingMode === mode
									? 'border-sky-600 bg-sky-600 text-white'
									: 'border-gray-300 bg-white text-gray-700'
							}`}
						>
							{mode === 'consonants-only'
								? 'Grade consonants only'
								: 'Grade consonants and niqqud'}
						</button>
					),
				)}

				<button
					onClick={startNewRound}
					disabled={candidates.length === 0}
					className="rounded-full border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
				>
					New round
				</button>
			</div>

			{candidates.length === 0 ? (
				<div className="rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
					{emptyStateMessage}
				</div>
			) : (
				<>
					<div className="mb-6 grid gap-4 md:grid-cols-3">
						<div className="rounded-3xl border bg-white p-5 shadow-sm">
							<p className="text-xs uppercase tracking-[0.2em] text-gray-500">
								Possible answers
							</p>
							<p className="mt-2 text-4xl font-bold text-neutral-800">
								{remainingCandidates.length}
							</p>
							<p className="mt-2 text-sm text-gray-600">
								Questions disappear when they stop helping.
							</p>
						</div>
						<div className="rounded-3xl border bg-white p-5 shadow-sm">
							<p className="text-xs uppercase tracking-[0.2em] text-gray-500">
								Questions asked
							</p>
							<p className="mt-2 text-4xl font-bold text-neutral-800">
								{askedQuestions.length}
							</p>
							<p className="mt-2 text-sm text-gray-600">
								Keep narrowing the answer bank before you guess.
							</p>
						</div>
						<div className="rounded-3xl border bg-white p-5 shadow-sm">
							<p className="text-xs uppercase tracking-[0.2em] text-gray-500">
								Questions left
							</p>
							<p className="mt-2 text-4xl font-bold text-neutral-800">
								{visibleQuestions.length}
							</p>
							<p className="mt-2 text-sm text-gray-600">
								Only relevant yes-or-no prompts stay visible.
							</p>
						</div>
					</div>

					<div className="mb-6 rounded-3xl border bg-white p-5 shadow-sm">
						<h2 className="mb-4 text-center text-2xl font-semibold text-neutral-800">
							Question bank
						</h2>
						<div className="flex flex-wrap justify-center gap-3">
							{visibleQuestions.length > 0 ? (
								visibleQuestions.map((question) => (
									<button
										key={question.key}
										onClick={() => handleQuestionClick(question.key)}
										className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 font-cardo text-xl text-sky-900 transition hover:border-sky-400 hover:bg-sky-100"
									>
										{question.question}
									</button>
								))
							) : (
								<p className="text-center text-gray-500">
									No more useful questions right now. Try guessing or start a new
									round.
								</p>
							)}
						</div>
					</div>

					<div className="mb-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
						<div className="rounded-3xl border bg-white p-5 shadow-sm">
							<h2 className="mb-4 text-center text-2xl font-semibold text-neutral-800">
								Conversation
							</h2>
							<div className="space-y-3">
								{askedQuestions.length > 0 ? (
									askedQuestions.map((item, index) => (
										<div
											key={`${item.key}-${index}`}
											className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
										>
											<p className="font-cardo text-2xl text-neutral-900">
												{item.question}
											</p>
											<p className="mt-2 font-cardo text-2xl text-sky-800">
												{item.response}
											</p>
										</div>
									))
								) : (
									<p className="text-center text-gray-500">
										Click a Hebrew question above to begin.
									</p>
								)}
							</div>
						</div>

						<div className="rounded-3xl border bg-white p-5 shadow-sm">
							<h2 className="mb-4 text-center text-2xl font-semibold text-neutral-800">
								Make your guess
							</h2>
							<input
								ref={inputRef}
								type="text"
								value={guess}
								onChange={(event) => {
									setGuess(event.target.value)
									setGuessFeedback(null)
								}}
								placeholder="כְּתֹב כָּאן"
								className="mb-4 w-full rounded-2xl border p-3 text-center text-4xl"
								dir="rtl"
								style={{ fontFamily: 'Times New Roman, serif' }}
								autoComplete="off"
							/>

							<button
								onClick={handleGuessSubmit}
								className="mb-4 w-full rounded-2xl bg-sky-600 px-4 py-3 text-lg font-semibold text-white transition hover:bg-sky-700"
							>
								Guess
							</button>

							{guessFeedback === 'correct' && targetCandidate && (
								<div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-center">
									<p className="text-lg font-semibold text-emerald-700">Correct!</p>
									<p className="mt-2 font-cardo text-4xl text-emerald-900">
										{targetCandidate.card.hebNiqqud || targetCandidate.card.heb}
									</p>
								</div>
							)}

							{guessFeedback === 'incorrect' && (
								<div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-center text-rose-700">
									לֹא. נְסֵה עוֹד.
								</div>
							)}
						</div>
					</div>

					<HebrewKeyboard
						onEnter={handleGuessSubmit}
						onKeyPress={updateGuessFromKeyboard}
					/>
				</>
			)}
		</div>
	)
}
