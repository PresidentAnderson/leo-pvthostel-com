'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({ errorInfo })
    
    // In production, send error to logging service
    // logErrorToService(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Our team has been notified and will fix this as soon as possible.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mb-6 p-3 bg-gray-100 rounded text-xs">
                <summary className="cursor-pointer font-medium">Error Details</summary>
                <pre className="mt-2 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
              
              <a
                href="/"
                className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </a>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Need help? Contact us at{' '}
                <a 
                  href="mailto:support@leo.pvthostel.com" 
                  className="text-blue-600 hover:underline"
                >
                  support@leo.pvthostel.com
                </a>
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

// Helper component for inline error states
export function InlineError({ 
  message, 
  onRetry, 
  className = "" 
}: { 
  message: string
  onRetry?: () => void
  className?: string 
}) {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-red-800 text-sm">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper component for loading states
export function LoadingSpinner({ 
  size = "md", 
  message, 
  className = "" 
}: {
  size?: "sm" | "md" | "lg"
  message?: string
  className?: string
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <RefreshCw className={`${sizeClasses[size]} animate-spin text-blue-600 mx-auto`} />
        {message && (
          <p className="mt-2 text-gray-600 text-sm">{message}</p>
        )}
      </div>
    </div>
  )
}

// Full screen loading component
export function FullScreenLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoadingSpinner size="lg" message={message} />
    </div>
  )
}