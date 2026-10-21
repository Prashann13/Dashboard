import { Component } from 'react'
import { BUTTON_SECONDARY } from '../lib/ui'
import { AlertTriangleIcon, RefreshIcon } from './icons'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state

    if (error) {
      return (
        <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
          <div className="grid size-14 place-items-center rounded-full bg-red-500/10 text-red-300 ring-1 ring-red-500/25">
            <AlertTriangleIcon className="size-6" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-semibold text-white">
            Something broke on this screen
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
            {import.meta.env.DEV
              ? error.message || 'An unexpected error occurred while rendering the dashboard.'
              : 'An unexpected error occurred while rendering the dashboard. Reload the page or try again.'}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={this.handleReset}
              className={`inline-flex items-center gap-2 ${BUTTON_SECONDARY}`}
            >
              <RefreshIcon className="size-4" />
              Try again
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              Reload the page
            </button>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
