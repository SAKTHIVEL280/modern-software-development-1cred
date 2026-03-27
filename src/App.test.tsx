import { describe, expect, it, beforeEach } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the header', () => {
    render(<App />)
    expect(screen.getByText('Todo Atelier')).toBeInTheDocument()
    expect(screen.getByText('Plan with intent')).toBeInTheDocument()
  })

  it('starts with empty state', () => {
    render(<App />)
    expect(screen.getByText('No tasks in this view yet.')).toBeInTheDocument()
    expect(screen.getByText('0 total tasks')).toBeInTheDocument()
  })

  it('adds a new todo', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('Add a task...')
    const addButton = screen.getByRole('button', { name: 'Add' })

    fireEvent.change(input, { target: { value: 'Buy groceries' } })
    fireEvent.click(addButton)

    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
    expect(screen.getByText('1 total task')).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('trims whitespace when adding todos', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('Add a task...')
    const addButton = screen.getByRole('button', { name: 'Add' })

    fireEvent.change(input, { target: { value: '  Trimmed task  ' } })
    fireEvent.click(addButton)

    expect(screen.getByText('Trimmed task')).toBeInTheDocument()
  })

  it('does not add empty todos', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('Add a task...')
    const addButton = screen.getByRole('button', { name: 'Add' })

    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(addButton)

    expect(screen.getByText('No tasks in this view yet.')).toBeInTheDocument()
    expect(screen.getByText('0 total tasks')).toBeInTheDocument()
  })

  it('adds todo on form submit (enter key)', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('Add a task...')

    fireEvent.change(input, { target: { value: 'Test task' } })
    fireEvent.submit(input.closest('form')!)

    expect(screen.getByText('Test task')).toBeInTheDocument()
  })

  it('toggles todo completion', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('Add a task...')
    const addButton = screen.getByRole('button', { name: 'Add' })

    fireEvent.change(input, { target: { value: 'Toggle me' } })
    fireEvent.click(addButton)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()

    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
    expect(screen.getByText('Toggle me').closest('.todo-item')).toHaveClass('done')

    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('deletes a todo', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('Add a task...')
    const addButton = screen.getByRole('button', { name: 'Add' })

    fireEvent.change(input, { target: { value: 'Delete me' } })
    fireEvent.click(addButton)

    const deleteButton = screen.getByRole('button', { name: 'Delete Delete me' })
    fireEvent.click(deleteButton)

    expect(screen.queryByText('Delete me')).not.toBeInTheDocument()
    expect(screen.getByText('No tasks in this view yet.')).toBeInTheDocument()
  })

  it('filters todos by active status', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('Add a task...')
    const addButton = screen.getByRole('button', { name: 'Add' })

    // Add two todos (newest appears first in list)
    fireEvent.change(input, { target: { value: 'Active task' } })
    fireEvent.click(addButton)
    fireEvent.change(input, { target: { value: 'Done task' } })
    fireEvent.click(addButton)

    // Complete the second task (Done task is first in the list since newest is on top)
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0]) // Done task is first (newest)

    // Filter to active - should show Active task
    fireEvent.click(screen.getByRole('tab', { name: 'Active' }))
    expect(screen.getByText('Active task')).toBeInTheDocument()
    expect(screen.queryByText('Done task')).not.toBeInTheDocument()

    // Check count shows 1 open
    const controls = screen.getByRole('region', { name: 'Task controls' })
    expect(within(controls).getByText('1')).toBeInTheDocument()

    // Filter to completed - should show Done task
    fireEvent.click(screen.getByRole('tab', { name: 'Done' }))
    expect(screen.queryByText('Active task')).not.toBeInTheDocument()
    expect(screen.getByText('Done task')).toBeInTheDocument()

    // Filter to all
    fireEvent.click(screen.getByRole('tab', { name: 'All' }))
    expect(screen.getByText('Active task')).toBeInTheDocument()
    expect(screen.getByText('Done task')).toBeInTheDocument()
  })

  it('clears completed todos', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('Add a task...')
    const addButton = screen.getByRole('button', { name: 'Add' })

    // Add and complete a todo
    fireEvent.change(input, { target: { value: 'Completed' } })
    fireEvent.click(addButton)
    fireEvent.click(screen.getByRole('checkbox'))

    // Clear completed
    const clearButton = screen.getByRole('button', { name: /Clear done/ })
    expect(clearButton).not.toBeDisabled()
    fireEvent.click(clearButton)

    expect(screen.getByText('No tasks in this view yet.')).toBeInTheDocument()
  })

  it('disables clear completed when no completed todos', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('Add a task...')
    const addButton = screen.getByRole('button', { name: 'Add' })

    fireEvent.change(input, { target: { value: 'Active' } })
    fireEvent.click(addButton)

    const clearButton = screen.getByRole('button', { name: /Clear done/ })
    expect(clearButton).toBeDisabled()
  })

  it('persists todos to localStorage', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('Add a task...')
    const addButton = screen.getByRole('button', { name: 'Add' })

    fireEvent.change(input, { target: { value: 'Persisted task' } })
    fireEvent.click(addButton)

    // Check localStorage was updated
    const stored = JSON.parse(localStorage.getItem('todo-react-ts-items') || '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].text).toBe('Persisted task')
  })

  it('loads todos from localStorage on mount', () => {
    localStorage.setItem(
      'todo-react-ts-items',
      JSON.stringify([{ id: 1, text: 'Pre-existing task', completed: false }]),
    )

    render(<App />)
    expect(screen.getByText('Pre-existing task')).toBeInTheDocument()
  })

  it('shows correct active count', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('Add a task...')
    const addButton = screen.getByRole('button', { name: 'Add' })

    fireEvent.change(input, { target: { value: 'Task 1' } })
    fireEvent.click(addButton)
    fireEvent.change(input, { target: { value: 'Task 2' } })
    fireEvent.click(addButton)

    // Both tasks are active (2 open)
    const controls = screen.getByRole('region', { name: 'Task controls' })
    expect(within(controls).getByText('2')).toBeInTheDocument()

    // Complete first task (Task 2 is first in list since newest is on top)
    fireEvent.click(screen.getAllByRole('checkbox')[0])

    expect(within(controls).getByText('1')).toBeInTheDocument()
  })
})