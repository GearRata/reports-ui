/**
 * Utility functions for pagination
 */

export interface PaginationValidationResult {
  isValid: boolean
  correctedPage?: number
  error?: string
}

/**
 * Validates pagination parameters
 */
export function validatePaginationParams(
  page: number,
  pageSize: number,
  totalItems: number
): PaginationValidationResult {
  // Validate page size
  if (pageSize <= 0) {
    return {
      isValid: false,
      error: "Page size must be greater than 0",
    }
  }

  if (pageSize > 1000) {
    return {
      isValid: false,
      error: "Page size cannot exceed 1000",
    }
  }

  // Validate page number
  if (page <= 0) {
    return {
      isValid: false,
      correctedPage: 1,
      error: "Page number must be greater than 0",
    }
  }

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize)

  // If no items, page 1 is valid
  if (totalItems === 0) {
    return { isValid: true }
  }

  // Check if page exceeds total pages
  if (page > totalPages) {
    return {
      isValid: false,
      correctedPage: totalPages,
      error: `Page ${page} exceeds total pages (${totalPages})`,
    }
  }

  return { isValid: true }
}

/**
 * Calculates visible page numbers for pagination controls
 */
export function calculateVisiblePages(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): number[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const half = Math.floor(maxVisible / 2)
  let start = Math.max(1, currentPage - half)
  const end = Math.min(totalPages, start + maxVisible - 1)

  // Adjust start if we're near the end
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

/**
 * Formats pagination info text
 */
export function formatPaginationInfo(
  currentPage: number,
  pageSize: number,
  totalItems: number,
  itemName: string = "รายการ"
): string {
  if (totalItems === 0) {
    return `ไม่พบ${itemName}`
  }

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return `แสดง ${startItem.toLocaleString()}-${endItem.toLocaleString()} จาก ${totalItems.toLocaleString()} ${itemName}`
}

/**
 * Debounce function for API calls
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt === maxRetries) {
        throw lastError
      }

      // Exponential backoff: 1s, 2s, 4s, 8s...
      const delay = baseDelay * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: Error): boolean {
  return (
    error.message.includes('fetch') ||
    error.message.includes('network') ||
    error.message.includes('Failed to fetch') ||
    error.name === 'NetworkError' ||
    error.name === 'TypeError'
  )
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: Error): string {
  if (isNetworkError(error)) {
    return "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต"
  }

  if (error.message.includes('404')) {
    return "ไม่พบข้อมูลที่ร้องขอ"
  }

  if (error.message.includes('500')) {
    return "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์"
  }

  if (error.message.includes('403')) {
    return "ไม่มีสิทธิ์เข้าถึงข้อมูล"
  }

  return error.message || "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ"
}