"use client"

import { useState, useEffect, useCallback } from "react"
import { PaginationParams, PaginationResponse, PaginationState } from "@/types/pagination"

interface PaginatedApiConfig {
  endpoint: string
  initialPage?: number
  initialPageSize?: number
  autoFetch?: boolean
}

interface PaginatedApiState<T> extends Omit<PaginationState<T>, 'loading'> {
  isLoading: boolean
}

interface PaginatedApiActions {
  fetchPage: (page: number, pageSize?: number) => Promise<void>
  setPageSize: (size: number) => void
  refresh: () => Promise<void>
  reset: () => void
}

export function usePaginatedApi<T = any>(
  config: PaginatedApiConfig
): PaginatedApiState<T> & PaginatedApiActions {
  const {
    endpoint,
    initialPage = 1,
    initialPageSize = 10,
    autoFetch = true,
  } = config

  const [state, setState] = useState<PaginatedApiState<T>>({
    data: [],
    currentPage: initialPage,
    pageSize: initialPageSize,
    totalItems: 0,
    totalPages: 0,
    isLoading: false,
    error: null,
  })

  const fetchPage = useCallback(async (page: number, pageSize?: number) => {
    const size = pageSize || state.pageSize
    
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const url = new URL(endpoint, process.env.NEXT_PUBLIC_API_BASE)
      url.searchParams.set('page', page.toString())
      url.searchParams.set('limit', size.toString())

      const response = await fetch(url.toString())
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
      }

      const result: PaginationResponse<T> = await response.json()
      
      setState(prev => ({
        ...prev,
        data: result.data || [],
        currentPage: result.pagination?.page || page,
        pageSize: result.pagination?.limit || size,
        totalItems: result.pagination?.total || 0,
        totalPages: result.pagination?.total_pages || 0,
        isLoading: false,
        error: null,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }))
    }
  }, [endpoint, state.pageSize])

  const setPageSize = useCallback((size: number) => {
    setState(prev => ({ ...prev, pageSize: size }))
    fetchPage(1, size) // Reset to first page when changing page size
  }, [fetchPage])

  const refresh = useCallback(async () => {
    await fetchPage(state.currentPage, state.pageSize)
  }, [fetchPage, state.currentPage, state.pageSize])

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentPage: initialPage,
      pageSize: initialPageSize,
    }))
    fetchPage(initialPage, initialPageSize)
  }, [fetchPage, initialPage, initialPageSize])

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchPage(initialPage, initialPageSize)
    }
  }, []) // Only run on mount

  return {
    ...state,
    fetchPage,
    setPageSize,
    refresh,
    reset,
  }
}