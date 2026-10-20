import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'
import { Button } from '../ui/Button'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by Life in Frames ErrorBoundary:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#090a0f] text-[#f3f4f6] flex items-center justify-center p-6 selection:bg-purple-500/30">
          <div className="max-w-md w-full bg-[#11131a] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h1 className="text-xl font-bold font-display tracking-tight text-[#f3f4f6] mb-2">
              Something went wrong
            </h1>
            <p className="text-xs sm:text-sm text-[#9da3b4] mb-6 leading-relaxed">
              An unexpected error occurred while rendering this frame. Your stored archive records remain safe.
            </p>

            {this.state.error && (
              <div className="bg-[#171a24] border border-white/[0.06] rounded-xl p-3 text-left mb-6 overflow-x-auto text-[11px] font-mono text-rose-300/90">
                {this.state.error.message || 'Unknown runtime error'}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={this.handleReload}
                leftIcon={<RotateCcw className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Reload Application
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={this.handleGoHome}
                leftIcon={<Home className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
