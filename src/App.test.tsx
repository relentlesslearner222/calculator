import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App integration', () => {
  it('renders the page title', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /percentage calculator/i }),
    ).toBeInTheDocument()
  })

  it('calculates percentage on happy path', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText(/part/i), '25')
    await user.type(screen.getByLabelText(/whole/i), '200')
    await user.click(screen.getByRole('button', { name: /calculate/i }))

    expect(screen.getByRole('status')).toHaveTextContent('12.5%')
  })

  it('shows divide-by-zero error when whole is 0', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText(/part/i), '10')
    await user.type(screen.getByLabelText(/whole/i), '0')
    await user.click(screen.getByRole('button', { name: /calculate/i }))

    expect(screen.getByRole('status')).toHaveTextContent(
      'Cannot divide by zero',
    )
  })

  it('resets result when part input changes', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText(/part/i), '25')
    await user.type(screen.getByLabelText(/whole/i), '200')
    await user.click(screen.getByRole('button', { name: /calculate/i }))
    expect(screen.getByRole('status')).toHaveTextContent('12.5%')

    await user.type(screen.getByLabelText(/part/i), '5')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('resets result when whole input changes', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText(/part/i), '5')
    await user.type(screen.getByLabelText(/whole/i), '5')
    await user.click(screen.getByRole('button', { name: /calculate/i }))
    expect(screen.getByRole('status')).toHaveTextContent('100%')

    await user.type(screen.getByLabelText(/whole/i), '0')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
