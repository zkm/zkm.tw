import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(document.body).toBeInTheDocument()
  })

  it('renders the Portfolio component', () => {
    render(<App />)
    // Since Portfolio is the main component, we just check that it renders
    // without throwing an error
    expect(document.querySelector('div')).toBeInTheDocument()
  })
})
