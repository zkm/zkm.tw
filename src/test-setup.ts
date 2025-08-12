import '@testing-library/jest-dom'
import React from 'react'
import { vi, beforeAll, afterAll } from 'vitest'

// Suppress React act warnings in test environment
const originalError = console.error
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('An update to') &&
      args[0].includes('inside a test was not wrapped in act')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// Global mock for framer-motion to avoid DOM prop warnings and act() warnings
// by stripping motion-only props and rendering plain elements.
vi.mock('framer-motion', () => ({
	motion: new Proxy({}, {
		   get: (_, prop) => {
			   return ({ children, ...props }: Record<string, unknown> & { children?: React.ReactNode }) => {
				   const Tag = typeof prop === 'string' ? prop : 'div'
				   // Strip motion props by omitting them from rest
				   const rest = { ...props }
				   delete rest.animate
				   delete rest.initial
				   delete rest.exit
				   delete rest.transition
				   delete rest.whileHover
				   delete rest.whileTap
				   delete rest.variants
				   delete rest.layout
				   delete rest.layoutId
				   delete rest.drag
				   delete rest.dragConstraints
				   delete rest.dragElastic
				   if (typeof Tag === 'string') {
					   return React.createElement(Tag, rest, children)
				   }
				   return React.createElement('div', rest, children)
			   }
		   }
	})
}))