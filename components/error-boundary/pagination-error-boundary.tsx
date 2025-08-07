"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface PaginationErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface PaginationErrorBoundaryProps {
  children: React.ReactNode
  onRetry?: () => void
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

export class PaginationErrorBoundary extends React.Component<
  PaginationErrorBoundaryProps,
  PaginationErrorBoundaryState
> {
  constructor(props: PaginationErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): PaginationErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Pagination Error Boundary caught an error:", error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    if (this.props.onRetry) {
      this.props.onRetry()
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} retry={this.handleRetry} />
      }

      return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h2 className="text-xl font-semibold text-red-700">เกิดข้อผิดพลาด</h2>
          </div>
          
          <div className="text-center mb-6 max-w-md">
            <p className="text-muted-foreground mb-2">
              ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง
            </p>
            <details className="text-sm text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">
                รายละเอียดข้อผิดพลาด
              </summary>
              <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                {this.state.error.message}
              </pre>
            </details>
          </div>

          <Button onClick={this.handleRetry} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            ลองใหม่
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}