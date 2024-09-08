import Link from 'next/link'
import { NotebookText } from 'lucide-react'

import { Button } from '@/components/ui/button'

type Props = {
	title: string
	description: string
}

export const PlayLessonBanner = ({ title, description }: Props) => {
	return (
		<div className="w-full rounded-xl bg-sky-500 p-5 text-white flex items-center justify-between">
			<div className="space-y-2.5">
				<h3 className="text-2xl font-bold">{title}</h3>
			</div>
		</div>
	)
}
