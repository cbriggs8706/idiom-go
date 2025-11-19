'use client'

import { LANGUAGES } from '@/i18n/languages'
import { usePathname, useRouter } from 'next/navigation'
import { startTransition } from 'react'
import { setLocale } from '@/actions/setLocale'

export function LanguageSwitcher({ locale }: { locale: string }) {
	const router = useRouter()
	const pathname = usePathname()
	const locales = Object.keys(LANGUAGES)

	async function handleChange(nextLocale: string) {
		if (!pathname) return

		// Save cookie
		await setLocale(nextLocale)

		// Break URL into segments
		const segments = pathname.split('/')

		// Find which segment is the current locale
		const localeIndex = segments.findIndex((seg) => locales.includes(seg))

		// Replace the locale in-place
		if (localeIndex !== -1) {
			segments[localeIndex] = nextLocale
		}

		startTransition(() => {
			router.push(segments.join('/') || '/')
		})
	}
	//TODO at the root instead of /test
	// async function handleChange(nextLocale: string) {
	// 	if (!pathname) return;

	// 	// Save cookie
	// 	await setLocale(nextLocale);

	// 	// Break URL into segments
	// 	const segments = pathname.split('/');

	// 	// Find which segment is the current locale
	// 	const localeIndex = segments.findIndex((seg) =>
	// 		locales.includes(seg)
	// 	);

	// 	// Replace the locale in-place
	// 	if (localeIndex !== -1) {
	// 		segments[localeIndex] = nextLocale;
	// 	}

	// 	startTransition(() => {
	// 		router.push(segments.join('/') || '/');
	// 	});
	// }

	return (
		<select
			className="border rounded px-2 py-1 bg-white"
			value={locale}
			onChange={(e) => handleChange(e.target.value)}
		>
			{locales.map((loc) => (
				<option key={loc} value={loc}>
					{LANGUAGES[loc].label}
				</option>
			))}
		</select>
	)
}
