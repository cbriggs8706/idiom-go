import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wide',
	{
		variants: {
			variant: {
				locked:
					'bg-neutral-200 text-primary-foreground hover:bg-neutral-200/90 border-neutral-400 border-b-4 active:border-b-0',
				default:
					'bg-white text-black border-slate-200 border-2 border-b-4 active:border-b-2 hover:bg-slate-100 text-slate-500',
				primary:
					'bg-sky-400 text-primary-foreground hover:bg-sky-400/90 border-sky-700 border-b-4 active:border-b-0',
				primaryOutline: 'bg-white text-sky-600 hover:bg-slate-100',
				secondary:
					'bg-sky-600 text-primary-foreground hover:bg-sky-600/90 border-sky-800 border-b-4 active:border-b-0',
				secondaryOutline: 'bg-white text-sky-600 hover:bg-slate-100',
				danger:
					'bg-rose-500 text-primary-foreground hover:bg-rose-500/90 border-rose-700 border-b-4 active:border-b-0',
				dangerOutline: 'bg-white text-rose-500 hover:bg-slate-100',
				super:
					'bg-indigo-500 text-primary-foreground hover:bg-indigo-500/90 border-indigo-700 border-b-4 active:border-b-0',
				superOutline: 'bg-white text-indigo-500 hover:bg-slate-100',
				ghost:
					'bg-transparent text-slate-500 border-transparent border-0 hover:bg-slate-100',
				sidebar:
					'bg-transparent text-slate-500 border-2 border-transparent hover:bg-slate-100 transition-none',
				sidebarOutline:
					'bg-sky-600/15 text-sky-600 border-sky-300 border-2 hover:bg-sky-600/20 transition-none',
				test: [
					'relative z-10 font-semibold text-slate-700 bg-transparent',

					// Gradient border ALWAYS visible
					'before:absolute before:inset-0 before:rounded-xl before:p-[2px]',
					'before:bg-gradient-to-r before:from-sky-400 before:to-indigo-500',
					'before:-z-10',

					// White fill layer (inside)
					'after:absolute after:inset-[2px] after:rounded-xl after:bg-white',
					'after:-z-10',

					// Hover effects
					'hover:scale-105 hover:shadow-[0_0_12px_rgba(56,189,248,0.6)]',

					'transition-transform duration-200',
				].join(' '),
				testOld: [
					'relative z-10 font-semibold text-[#4b3b26] bg-transparent',

					'before:absolute before:inset-0 before:rounded-xl before:p-[2px]',
					'before:bg-gradient-to-r before:from-[#b08c59] before:to-[#d4b892] before:-z-10',

					'after:absolute after:inset-[2px] after:rounded-xl after:bg-[#f6ecd2] after:-z-10',

					'hover:scale-[1.04] hover:shadow-[0_0_10px_rgba(212,184,146,0.7)]',

					'shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]',
					'transition-transform duration-200',
				].join(' '),
				testStone: [
					'relative z-10 font-semibold text-[#3f372e] bg-transparent',

					// Stone border (sand → limestone)
					'before:absolute before:inset-0 before:rounded-xl before:p-[3px]',
					'before:bg-gradient-to-br before:from-[#d6c7a1] before:to-[#b8a98b] before:-z-10',

					// Stone fill
					'after:absolute after:inset-[3px] after:rounded-xl after:bg-[#e9dfc7] after:-z-10',

					// Stone texture simulation
					'shadow-[inset_0_1px_3px_rgba(0,0,0,0.25)]',

					// Hover glow (warm torchlight)
					'hover:scale-[1.03] hover:shadow-[0_0_12px_rgba(181,150,109,0.6)]',

					'transition-transform duration-200',
				].join(' '),
				testScrollBurnt: [
					'relative z-10 font-semibold text-[#4b3715] bg-transparent',

					// Burnt edge border
					'before:absolute before:inset-0 before:rounded-xl before:p-[3px]',
					'before:bg-gradient-to-r before:from-[#3b2d1b] before:to-[#8a5c2e] before:-z-10',

					// Burnt parchment fill
					'after:absolute after:inset-[3px] after:rounded-xl after:bg-[#f5e4c2] after:-z-10',

					// Inner singe shadow
					'shadow-[inset_0_0_10px_rgba(0,0,0,0.35)]',

					// Hover fire-glow
					'hover:scale-[1.04] hover:shadow-[0_0_14px_rgba(255,153,51,0.7)]',

					'transition-transform duration-200',
				].join(' '),
				testTorahHandles: [
					'relative z-10 font-semibold text-[#4a3b2b] bg-transparent',

					// Wood gradient border (olive → walnut)
					'before:absolute before:inset-0 before:rounded-xl before:p-[3px]',
					'before:bg-gradient-to-r before:from-[#8c6f4f] before:via-[#c2ab86] before:to-[#8c6f4f] before:-z-10',

					// Ivory scroll center
					'after:absolute after:inset-[3px] after:rounded-xl after:bg-[#fdf8ee] after:-z-10',

					// Very slight inner bevel
					'shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]',

					// Hover golden glow (Menorah-like)
					'hover:scale-[1.04] hover:shadow-[0_0_12px_rgba(240,180,80,0.6)]',

					'transition-transform duration-200',
				].join(' '),
				testDesert: [
					'relative z-10 font-semibold text-[#5a4a36] bg-transparent',

					// Dune border
					'before:absolute before:inset-0 before:rounded-xl before:p-[2px]',
					'before:bg-gradient-to-br before:from-[#daba8a] before:to-[#c79d6a] before:-z-10',

					// Sand fill
					'after:absolute after:inset-[2px] after:rounded-xl after:bg-[#f3e1c5] after:-z-10',

					// Dusty texture
					'shadow-[inset_0_1px_3px_rgba(150,120,90,0.25)]',

					// Sunlit hover glow
					'hover:scale-[1.04] hover:shadow-[0_0_15px_rgba(255,204,102,0.55)]',

					'transition-transform duration-200',
				].join(' '),
				testPriestlyGems: [
					'relative z-10 font-semibold text-[#2d1e40] bg-transparent',

					// Gem border (royal purple → sapphire → emerald)
					'before:absolute before:inset-0 before:rounded-xl before:p-[3px]',
					'before:bg-gradient-to-r before:from-[#6a3ea1] before:via-[#305ac8] before:to-[#1c9d6d] before:-z-10',

					// Polished stone center
					'after:absolute after:inset-[3px] after:rounded-xl after:bg-[#faf7ff] after:-z-10',

					// Inner gemstone shine
					'shadow-[inset_0_0_6px_rgba(0,0,0,0.2)]',

					// Royal glow on hover
					'hover:scale-[1.05] hover:shadow-[0_0_14px_rgba(80,55,120,0.7)]',

					'transition-transform duration-200',
				].join(' '),
				testClay: [
					'relative z-10 font-semibold text-[#4a3728] bg-transparent',

					// Clay outer edge (irregular warm tones)
					'before:absolute before:inset-0 before:rounded-xl before:p-[3px]',
					'before:bg-gradient-to-br before:from-[#c89b6b] before:to-[#ad8359] before:-z-10',

					// Clay interior (lighter center)
					'after:absolute after:inset-[3px] after:rounded-xl after:bg-[#d7ab7d] after:-z-10',

					// Carved-in text look
					'shadow-[inset_0_0_4px_rgba(0,0,0,0.25)]',

					// Hover: slightly pressed deeper
					'hover:scale-[0.98] hover:shadow-[inset_0_0_8px_rgba(0,0,0,0.35)]',

					'transition-all duration-200',
				].join(' '),
				testSeal: [
					'relative z-10 font-semibold text-[#3b2a1f] bg-transparent',

					// Thick pressed outer ring
					'before:absolute before:inset-0 before:rounded-xl before:p-[4px]',
					'before:bg-gradient-to-br before:from-[#a06a3d] before:to-[#7f5230] before:-z-10',

					// Inner seal wax area
					'after:absolute after:inset-[4px] after:rounded-xl after:bg-[#b87a4e] after:-z-10',

					// Embossed/pressed effect
					'shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)]',

					// Hover: deeper stamp + tiny tilt
					'hover:scale-[0.97] hover:-rotate-[0.5deg]',
					'hover:shadow-[inset_0_4px_10px_rgba(0,0,0,0.45)]',

					'transition-all duration-200',
				].join(' '),
				testLeather: [
					'relative z-10 font-semibold text-[#3d2c1f] bg-transparent',

					// Leather outer layer
					'before:absolute before:inset-0 before:rounded-xl before:p-[3px]',
					'before:bg-gradient-to-br before:from-[#8a6d4c] before:to-[#5c4731] before:-z-10',

					// Inner leather fill
					'after:absolute after:inset-[3px] after:rounded-xl after:bg-[#7a5d3f] after:-z-10',

					// Stitched edge effect (small white dots)
					'shadow-[0_0_0_2px_rgba(255,255,255,0.15),inset_0_1px_3px_rgba(0,0,0,0.3)]',

					// Hover: leather bend (gentle vertical scale)
					'hover:scale-y-[0.97] hover:shadow-[0_0_8px_rgba(0,0,0,0.3)]',

					'transition-all duration-200',
				].join(' '),
				testCopperPatina: [
					'relative z-10 font-semibold text-[#15322f]',
					'bg-[#6ea090]', // base patina
					'rounded-xl',

					// Multi-layer hammered metal texture
					'shadow-[inset_0_0_8px_rgba(0,0,0,0.25),inset_0_2px_4px_rgba(255,255,255,0.08),0_4px_6px_rgba(0,0,0,0.2)]',

					// Subtle patina mottling using gradients
					'bg-gradient-to-br from-[#7db6a3] via-[#6ea090] to-[#5c8d7f]',

					// Slight rust spotting using drop shadows
					'after:absolute after:inset-0 after:rounded-xl',
					'after:bg-[radial-gradient(circle_at_20%_30%,rgba(150,80,40,0.25),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(100,50,20,0.2),transparent_60%)]',
					'after:pointer-events-none',

					// Hover metallic sheen
					'hover:brightness-110 hover:scale-[1.03] hover:shadow-[inset_0_0_10px_rgba(0,0,0,0.3),0_6px_12px_rgba(0,0,0,0.25)]',

					'transition-all duration-200',
				].join(' '),
				testCopper: [
					'relative z-10 font-semibold text-[#15322f] rounded-xl',

					// Base patina fill
					'bg-gradient-to-br from-[#7eb7a6] via-[#6ea090] to-[#5b8578]',

					// Subtle metallic depth
					'shadow-[inset_0_0_6px_rgba(0,0,0,0.25),inset_0_2px_4px_rgba(255,255,255,0.08),0_3px_4px_rgba(0,0,0,0.25)]',

					// Rust / oxidation spots (pseudo-element)
					'after:absolute after:inset-0 after:rounded-xl',
					'after:bg-[radial-gradient(circle_at_20%_25%,rgba(120,70,40,0.20),transparent_60%),radial-gradient(circle_at_85%_70%,rgba(150,90,50,0.15),transparent_60%)]',
					'after:pointer-events-none after:z-0',

					// Hover — metallic sheen & lift
					'hover:brightness-110 hover:shadow-[inset_0_0_8px_rgba(0,0,0,0.3),0_5px_10px_rgba(0,0,0,0.3)]',
					'hover:scale-[1.03]',

					'transition-all duration-200',
				].join(' '),
			},
			size: {
				default: 'h-11 px-4 py-2',
				sm: 'h-9 px-3',
				lg: 'h-12 px-8',
				icon: 'h-10 w-10',
				rounded: 'rounded-full',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
)

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button'
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		)
	}
)
Button.displayName = 'Button'

export { Button, buttonVariants }
