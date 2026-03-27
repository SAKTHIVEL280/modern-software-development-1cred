import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  createTodo,
  getActiveCount,
  getCompletedCount,
  readTodos,
  toVisibleTodos,
  writeTodos,
} from './lib/todoStorage'
import './App.css'

export type Todo = {
  id: number
  text: string
  completed: boolean
}

export type Filter = 'all' | 'active' | 'completed'

function App() {
  const [tasks, setTasks] = useState<Todo[]>(() => readTodos())
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    writeTodos(tasks)
  }, [tasks])

  const activeCount = useMemo(() => getActiveCount(tasks), [tasks])

  const completedCount = useMemo(() => getCompletedCount(tasks), [tasks])

  const visibleTasks = useMemo(() => toVisibleTodos(tasks, filter), [filter, tasks])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = inputValue.trim()

    if (!trimmed) {
      return
    }

    setTasks((prev) => [createTodo(trimmed), ...prev])
    setInputValue('')
  }

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed))
  }

  return (
    <div className="page">
      <div className="grain" aria-hidden="true"></div>
      <main className="todo-shell">
        <header className="todo-header">
          <p className="kicker">Plan with intent</p>
          <h1>Todo Atelier</h1>
          <p className="subtitle">
            Keep your day sharp with a focused, lightweight task board.
          </p>
        </header>

        <form className="composer" onSubmit={handleSubmit}>
          <label htmlFor="todo-input" className="sr-only">
            New task
          </label>
          <input
            id="todo-input"
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Add a task..."
            autoComplete="off"
          />
          <button type="submit">Add</button>
        </form>

        <section className="controls" aria-label="Task controls">
          <div className="count-chip">
            <span>{activeCount}</span> open
          </div>
          <div className="filters" role="tablist" aria-label="Filters">
            <button
              type="button"
              className={filter === 'all' ? 'is-active' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={filter === 'active' ? 'is-active' : ''}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              type="button"
              className={filter === 'completed' ? 'is-active' : ''}
              onClick={() => setFilter('completed')}
            >
              Done
            </button>
          </div>
          <button
            type="button"
            className="ghost-button"
            onClick={clearCompleted}
            disabled={completedCount === 0}
          >
            Clear done ({completedCount})
          </button>
        </section>

        <ul className="todo-list" aria-live="polite">
          {visibleTasks.length === 0 ? (
            <li className="empty-state">No tasks in this view yet.</li>
          ) : (
            visibleTasks.map((task, index) => (
              <li
                className={`todo-item ${task.completed ? 'done' : ''}`}
                style={{ animationDelay: `${index * 70}ms` }}
                key={task.id}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span>{task.text}</span>
                </label>
                <button
                  type="button"
                  className="delete"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete ${task.text}`}
                >
                  Remove
                </button>
              </li>
            ))
          )}
        </ul>

        <footer className="footnote">
          {tasks.length} total task{tasks.length === 1 ? '' : 's'}
        </footer>
      </main>
    </div>
  )
}

export default App
