import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useIPPhonesForDropdown, useProgramsForDropdown } from '@/api/route'

// Mock fetch responses
const mockIPPhonesResponse = {
  data: [
    { id: 1, number: 101, name: 'Phone 1', branch_id: 1, department_id: 1 },
    { id: 2, number: 102, name: 'Phone 2', branch_id: 1, department_id: 2 }
  ],
  pagination: { page: 1, limit: 500, total: 2, total_pages: 1 }
}

const mockProgramsResponse = {
  data: [
    { id: 1, name: 'Program 1' },
    { id: 2, name: 'Program 2' }
  ],
  pagination: { page: 1, limit: 500, total: 2, total_pages: 1 }
}

describe('Enhanced API Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset fetch mock
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('useIPPhonesForDropdown', () => {
    it('should load IP phones data initially', async () => {
      // Mock successful API response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockIPPhonesResponse
      })

      const { result } = renderHook(() => useIPPhonesForDropdown())

      // Initially loading
      expect(result.current.loading).toBe(true)
      expect(result.current.ipPhones).toEqual([])

      // Wait for data to load
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.ipPhones).toEqual(mockIPPhonesResponse.data)
      expect(result.current.error).toBe(null)
      expect(result.current.hasCachedData).toBe(true)
    })

    it('should provide refresh functionality', async () => {
      // Initial load
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockIPPhonesResponse
      })

      const { result } = renderHook(() => useIPPhonesForDropdown())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Mock refresh response with updated data
      const updatedResponse = {
        ...mockIPPhonesResponse,
        data: [
          ...mockIPPhonesResponse.data,
          { id: 3, number: 103, name: 'Phone 3', branch_id: 1, department_id: 1 }
        ]
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => updatedResponse
      })

      // Trigger refresh
      await result.current.refresh()

      await waitFor(() => {
        expect(result.current.ipPhones).toEqual(updatedResponse.data)
      })

      expect(result.current.refreshError).toBe(null)
    })

    it('should handle refresh errors gracefully', async () => {
      // Initial successful load
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockIPPhonesResponse
      })

      const { result } = renderHook(() => useIPPhonesForDropdown())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Mock refresh failure
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

      // Trigger refresh
      await result.current.refresh()

      await waitFor(() => {
        expect(result.current.refreshError).toBe('Network error')
      })

      // Should still have cached data
      expect(result.current.ipPhones).toEqual(mockIPPhonesResponse.data)
      expect(result.current.hasCachedData).toBe(true)
    })

    it('should return cached data when refresh fails', async () => {
      // Initial successful load
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockIPPhonesResponse
      })

      const { result } = renderHook(() => useIPPhonesForDropdown())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const originalData = result.current.ipPhones

      // Mock API failure on refresh
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('API Error'))

      await result.current.refresh()

      await waitFor(() => {
        expect(result.current.refreshError).toBe('API Error')
      })

      // Should still return cached data
      expect(result.current.ipPhones).toEqual(originalData)
      expect(result.current.hasCachedData).toBe(true)
    })
  })

  describe('useProgramsForDropdown', () => {
    it('should load programs data initially', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockProgramsResponse
      })

      const { result } = renderHook(() => useProgramsForDropdown())

      expect(result.current.loading).toBe(true)
      expect(result.current.programs).toEqual([])

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.programs).toEqual(mockProgramsResponse.data)
      expect(result.current.error).toBe(null)
      expect(result.current.hasCachedData).toBe(true)
    })

    it('should provide refresh functionality', async () => {
      // Initial load
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockProgramsResponse
      })

      const { result } = renderHook(() => useProgramsForDropdown())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Mock refresh with new data
      const updatedResponse = {
        ...mockProgramsResponse,
        data: [
          ...mockProgramsResponse.data,
          { id: 3, name: 'Program 3' }
        ]
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => updatedResponse
      })

      await result.current.refresh()

      await waitFor(() => {
        expect(result.current.programs).toEqual(updatedResponse.data)
      })

      expect(result.current.refreshError).toBe(null)
    })

    it('should handle refresh errors gracefully', async () => {
      // Initial successful load
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockProgramsResponse
      })

      const { result } = renderHook(() => useProgramsForDropdown())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Mock refresh failure
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Server error'))

      await result.current.refresh()

      await waitFor(() => {
        expect(result.current.refreshError).toBe('Server error')
      })

      // Should still have cached data
      expect(result.current.programs).toEqual(mockProgramsResponse.data)
      expect(result.current.hasCachedData).toBe(true)
    })
  })
})