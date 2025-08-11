import '@testing-library/jest-dom'
import React from 'react'
import { vi } from 'vitest'

// Global mock for framer-motion to avoid DOM prop warnings and act() warnings
// by stripping motion-only props and rendering plain elements.
vi.mock('framer-motion', () => ({
	motion: new Proxy({}, {
		get: (_, prop) => {
			return ({ children, ...props }: any) => {
				const Tag = typeof prop === 'string' ? prop : 'div'
				const {
					// strip motion props
					animate,
					initial,
					exit,
					transition,
					whileHover,
					whileTap,
					variants,
					layout,
					layoutId,
					drag,
					dragConstraints,
					dragElastic,
					...rest
				} = props || {}
			return React.createElement(Tag as any, rest, children)
			}
		}
	})
}))