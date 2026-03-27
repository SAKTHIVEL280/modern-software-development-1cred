import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Unhandled UI error', { error, errorInfo })
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main className="error-shell" role="alert" aria-live="assertive">
          <h1>Something went wrong</h1>
          <p>
            The app hit an unexpected error. Refresh the page to continue.
          </p>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
