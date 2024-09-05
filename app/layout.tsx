import type { Metadata } from 'next'
import { Nunito, Frank_Ruhl_Libre } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from '@/components/ui/sonner'
import { ExitModal } from '@/components/modals/exit-modal'
import { HeartsModal } from '@/components/modals/hearts-modal'
import { PracticeModal } from '@/components/modals/practice-modal'
import './globals.css'

// const font = Frank_Ruhl_Libre({ subsets: ['hebrew'] })
const font = Nunito({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'IdiomGo',
	description: 'Language Learn Made Fun With Comprehensible Input',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={font.className}>
					<Toaster />
					<ExitModal />
					<HeartsModal />
					<PracticeModal />
					{children}
				</body>
			</html>
		</ClerkProvider>
	)
}
