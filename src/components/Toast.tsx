'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertTriangle, Info, X, AlertCircle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  persistent?: boolean
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void
  hideToast: (id: string) => void
  hideAllToasts: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
  maxToasts?: number
}

export function ToastProvider({ children, maxToasts = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (toastData: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 15)
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toastData
    }

    setToasts(prev => {
      const updated = [newToast, ...prev].slice(0, maxToasts)
      return updated
    })

    // Auto-hide non-persistent toasts
    if (!newToast.persistent && newToast.duration) {
      setTimeout(() => {
        hideToast(id)
      }, newToast.duration)
    }
  }

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const hideAllToasts = () => {
    setToasts([])
  }

  return (
    <ToastContext.Provider value={{ showToast, hideToast, hideAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onHide={hideToast} />
    </ToastContext.Provider>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onHide: (id: string) => void
}

function ToastContainer({ toasts, onHide }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onHide={onHide} />
        ))}
      </AnimatePresence>
    </div>
  )
}

interface ToastItemProps {
  toast: Toast
  onHide: (id: string) => void
}

function ToastItem({ toast, onHide }: ToastItemProps) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getColorClasses = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
    }
  }

  const getTitleColorClass = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-900'
      case 'error':
        return 'text-red-900'
      case 'warning':
        return 'text-yellow-900'
      case 'info':
        return 'text-blue-900'
    }
  }

  const getMessageColorClass = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-700'
      case 'error':
        return 'text-red-700'
      case 'warning':
        return 'text-yellow-700'
      case 'info':
        return 'text-blue-700'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`
        p-4 rounded-lg border shadow-lg backdrop-blur-sm
        ${getColorClasses()}
      `}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="ml-3 flex-1">
          <h4 className={`text-sm font-medium ${getTitleColorClass()}`}>
            {toast.title}
          </h4>
          {toast.message && (
            <p className={`mt-1 text-sm ${getMessageColorClass()}`}>
              {toast.message}
            </p>
          )}
        </div>
        
        <button
          onClick={() => onHide(toast.id)}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

// Helper hooks for common toast types
export function useSuccessToast() {
  const { showToast } = useToast()
  return (title: string, message?: string) => 
    showToast({ type: 'success', title, message })
}

export function useErrorToast() {
  const { showToast } = useToast()
  return (title: string, message?: string) => 
    showToast({ type: 'error', title, message, duration: 8000 })
}

export function useWarningToast() {
  const { showToast } = useToast()
  return (title: string, message?: string) => 
    showToast({ type: 'warning', title, message, duration: 6000 })
}

export function useInfoToast() {
  const { showToast } = useToast()
  return (title: string, message?: string) => 
    showToast({ type: 'info', title, message })
}