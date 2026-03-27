import type { Filter, Todo } from '../App'

const STORAGE_KEY = 'todo-react-ts-items'
const MAX_TODO_LENGTH = 240

const isTodo = (value: unknown): value is Todo => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.id === 'number' &&
    Number.isFinite(candidate.id) &&
    typeof candidate.text === 'string' &&
    candidate.text.trim().length > 0 &&
    candidate.text.length <= MAX_TODO_LENGTH &&
    typeof candidate.completed === 'boolean'
  )
}

export const toVisibleTodos = (todos: Todo[], filter: Filter): Todo[] => {
  if (filter === 'active') {
    return todos.filter((task) => !task.completed)
  }

  if (filter === 'completed') {
    return todos.filter((task) => task.completed)
  }

  return todos
}

export const getActiveCount = (todos: Todo[]): number =>
  todos.filter((task) => !task.completed).length

export const getCompletedCount = (todos: Todo[]): number =>
  todos.filter((task) => task.completed).length

export const readTodos = (): Todo[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as unknown

    if (!Array.isArray(parsed)) {
      localStorage.removeItem(STORAGE_KEY)
      return []
    }

    const cleaned = parsed.filter(isTodo).map((todo) => ({
      ...todo,
      text: todo.text.trim(),
    }))

    return cleaned
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

export const writeTodos = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch {
    // Swallow quota/storage errors to keep the UI responsive.
  }
}

export const createTodo = (text: string): Todo => {
  const trimmed = text.trim().slice(0, MAX_TODO_LENGTH)

  // crypto.randomUUID is preferred when available; fallback keeps compatibility.
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? Number.parseInt(crypto.randomUUID().replace(/-/g, '').slice(0, 12), 16)
      : Date.now()

  return {
    id,
    text: trimmed,
    completed: false,
  }
}
