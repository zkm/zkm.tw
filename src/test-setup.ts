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
	}),
	AnimatePresence: ({ children }: { children?: React.ReactNode }) => React.createElement('div', {}, children)
}))

// Global mock for lucide-react icons
vi.mock('lucide-react', () => ({
  Award: () => React.createElement('div', { 'data-testid': 'award-icon' }, 'Award'),
  GraduationCap: () => React.createElement('div', { 'data-testid': 'graduation-icon' }, 'GraduationCap'),
  HeartHandshake: () => React.createElement('div', { 'data-testid': 'heart-icon' }, 'HeartHandshake'),
  Briefcase: () => React.createElement('div', { 'data-testid': 'briefcase-icon' }, 'Briefcase'),
  Code2: () => React.createElement('div', { 'data-testid': 'code-icon' }, 'Code2'),
  Mail: () => React.createElement('div', { 'data-testid': 'mail-icon' }, 'Mail'),
  Phone: () => React.createElement('div', { 'data-testid': 'phone-icon' }, 'Phone'),
  Globe: () => React.createElement('div', { 'data-testid': 'globe-icon' }, 'Globe'),
  Star: () => React.createElement('div', { 'data-testid': 'star-icon' }, 'Star'),
  Book: () => React.createElement('div', { 'data-testid': 'book-icon' }, 'Book'),
  Users: () => React.createElement('div', { 'data-testid': 'users-icon' }, 'Users'),
  Copy: () => React.createElement('div', { 'data-testid': 'copy-icon' }, 'Copy'),
  Check: () => React.createElement('div', { 'data-testid': 'check-icon' }, 'Check'),
  Shield: () => React.createElement('div', { 'data-testid': 'shield-icon' }, 'Shield'),
  Palette: () => React.createElement('div', { 'data-testid': 'palette-icon' }, 'Palette'),
  Server: () => React.createElement('div', { 'data-testid': 'server-icon' }, 'Server'),
  Settings: () => React.createElement('div', { 'data-testid': 'settings-icon' }, 'Settings'),
  Github: () => React.createElement('div', { 'data-testid': 'github-icon' }, 'Github'),
  Linkedin: () => React.createElement('div', { 'data-testid': 'linkedin-icon' }, 'Linkedin'),
  Instagram: () => React.createElement('div', { 'data-testid': 'instagram-icon' }, 'Instagram'),
  FileText: () => React.createElement('div', { 'data-testid': 'file-text-icon' }, 'FileText'),
  MessageCircle: () => React.createElement('div', { 'data-testid': 'message-circle-icon' }, 'MessageCircle'),
  X: () => React.createElement('div', { 'data-testid': 'x-icon' }, 'X'),
  Send: () => React.createElement('div', { 'data-testid': 'send-icon' }, 'Send'),
  User: () => React.createElement('div', { 'data-testid': 'user-icon' }, 'User'),
  Bot: () => React.createElement('div', { 'data-testid': 'bot-icon' }, 'Bot'),
}))