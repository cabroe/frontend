// First, create an ErrorBoundary component
import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border rounded-md bg-destructive/10 text-destructive">
          Ein Fehler ist aufgetreten. Bitte laden Sie die Seite neu.
        </div>
      )
    }

    return this.props.children
  }
}
