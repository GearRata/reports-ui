"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PaginationState } from "@/types/pagination"
import {
  validatePaginationParams,
  retryWithBackoff,
  getErrorMessage,
  debounce
} from "@/lib/pagination-utils"

interface PaginationConfig {
  apiEndpoint: string
  initialPage?: number
  initialPageSize?: number
  enableUrlSync?: boolean
}

interface UsePaginationState extends Omit<PaginationState, 'loading'> {
  isLoading: boolean
}

interface PaginationActions {
  goToPage: (page: number) => void
  changePageSize: (size: number) => void
  refresh: () => void
  reset: () => void
}

export function usePagination(config: PaginationConfig): UsePaginationState & PaginationActions {
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    apiEndpoint,
    initialPage = 1,
    initialPageSize = 10,
    enableUrlSync = true,
  } = config

  // Get initial values from URL if URL sync is enabled
  const getInitialPage = () => {
    if (enableUrlSync) {
      const pageFromUrl = searchParams.get('page')
      return pageFromUrl ? parseInt(pageFromUrl, 10) : initialPage
    }
    return initialPage
  }

  const getInitialPageSize = () => {
    if (enableUrlSync) {
      const pageSizeFromUrl = searchParams.get('limit')
      return pageSizeFromUrl ? parseInt(pageSizeFromUrl, 10) : initialPageSize
    }
    return initialPageSize
  }

  const [state, setState] = useState<UsePaginationState>({
    currentPage: getInitialPage(),
    pageSize: getInitialPageSize(),
    totalItems: 0,
    totalPages: 0,
    isLoading: false,
    error: null,
    data: [],
  })

  // Update URL when pagination state changes
  const updateUrl = useCallback((page: number, pageSize: number) => {
    if (!enableUrlSync) return

    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    params.set('limit', pageSize.toString())

    router.push(`?${params.toString()}`, { scroll: false })
  }, [enableUrlSync, router, searchParams])

  // Fetch data from API with retry logic
  const fetchData = useCallback(async (page: number, pageSize: number) => {
    // Validate parameters
    const validation = validatePaginationParams(page, pageSize, state.totalItems)
    if (!validation.isValid && validation.correctedPage) {
      page = validation.correctedPage
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const result = await retryWithBackoff(async () => {
        const url = new URL(apiEndpoint, process.env.NEXT_PUBLIC_API_BASE)
        url.searchParams.set('page', page.toString())
        url.searchParams.set('limit', pageSize.toString())

        const response = await fetch(url.toString())

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        return await response.json()
      }, 3, 1000)

      setState(prev => ({
        ...prev,
        data: result.data || [],
        totalItems: result.pagination?.total || 0,
        totalPages: result.pagination?.total_pages || 0,
        currentPage: result.pagination?.page || page,
        pageSize: result.pagination?.limit || pageSize,
        isLoading: false,
        error: null,
      }))

      updateUrl(page, pageSize)
    } catch (error) {
      const errorMessage = getErrorMessage(error instanceof Error ? error : new Error(String(error)))
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
    }
  }, [apiEndpoint, updateUrl, state.totalItems])

  // Debounced fetch to prevent excessive API calls
  const debouncedFetchData = useCallback(
    debounce((page: number, pageSize: number) => {
      fetchData(page, pageSize)
    }, 300),
    [fetchData]
  )

  // Actions
  const goToPage = useCallback((page: number) => {
    if (page < 1 || (state.totalPages > 0 && page > state.totalPages)) {
      return
    }
    debouncedFetchData(page, state.pageSize)
  }, [debouncedFetchData, state.pageSize, state.totalPages])

  const changePageSize = useCallback((size: number) => {
    if (size < 1) return
    debouncedFetchData(1, size) // Reset to first page when changing page size
  }, [debouncedFetchData])

  const refresh = useCallback(() => {
    fetchData(state.currentPage, state.pageSize)
  }, [fetchData, state.currentPage, state.pageSize])

  const reset = useCallback(() => {
    fetchData(initialPage, initialPageSize)
  }, [fetchData, initialPage, initialPageSize])

  // Initial data fetch
  useEffect(() => {
    fetchData(state.currentPage, state.pageSize)
  }, []) // Only run on mount

  // Sync with URL changes (when user navigates back/forward)
  useEffect(() => {
    if (!enableUrlSync) return

    const pageFromUrl = searchParams.get('page')
    const pageSizeFromUrl = searchParams.get('limit')

    const newPage = pageFromUrl ? parseInt(pageFromUrl, 10) : initialPage
    const newPageSize = pageSizeFromUrl ? parseInt(pageSizeFromUrl, 10) : initialPageSize

    if (newPage !== state.currentPage || newPageSize !== state.pageSize) {
      fetchData(newPage, newPageSize)
    }
  }, [searchParams, enableUrlSync, initialPage, initialPageSize])

  return {
    ...state,
    goToPage,
    changePageSize,
    refresh,
    reset,
  }
}