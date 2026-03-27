import { describe, expect, it, vi } from 'vitest'
import {
  createTodo,
  getActiveCount,
  getCompletedCount,
  readTodos,
  toVisibleTodos,
} from './todoStorage'
import type { Todo } from '../App'

const sampleTodos: Todo[] = [
  { id: 1, text: 'Ship docs', completed: false },
  { id: 2, text: 'Fix bugs', completed: true },
]

describe('todoStorage', () => {
  it('filters todos by active and completed status', () => {
    expect(toVisibleTodos(sampleTodos, 'all')).toHaveLength(2)
    expect(toVisibleTodos(sampleTodos, 'active')).toEqual([sampleTodos[0]])
    expect(toVisibleTodos(sampleTodos, 'completed')).toEqual([sampleTodos[1]])
  })

  it('computes counts correctly', () => {
    expect(getActiveCount(sampleTodos)).toBe(1)
    expect(getCompletedCount(sampleTodos)).toBe(1)
  })

  it('returns empty list for invalid storage payload', () => {
    localStorage.setItem('todo-react-ts-items', '{bad json')
    expect(readTodos()).toEqual([])
  })

  it('drops invalid todo objects from storage payload', () => {
    localStorage.setItem(
      'todo-react-ts-items',
      JSON.stringify([
        { id: 1, text: '  Keep me  ', completed: false },
        { id: 'bad', text: 'remove me', completed: true },
      ]),
    )

    expect(readTodos()).toEqual([{ id: 1, text: 'Keep me', completed: false }])
  })

  it('creates todos using randomUUID when available', () => {
    const randomUUIDSpy = vi
      .spyOn(globalThis.crypto, 'randomUUID')
      .mockReturnValue('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa')

    const created = createTodo('  New Task  ')

    expect(created.text).toBe('New Task')
    expect(created.completed).toBe(false)
    expect(created.id).toBeTypeOf('number')

    randomUUIDSpy.mockRestore()
  })
})
