import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TasksPage from '@/app/tasks/page'

// Mock API responses
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

// Mock all the required modules
vi.mock('@/api/route', () => {
  const mockRefreshIPPhones = vi.fn()
  const mockRefreshPrograms = vi.fn()
  
  return {
    useTasksNewPaginated: vi.fn(() => ({
      tasks: [],
      currentPage: 1,
      pageSize: 100,
      totalItems: 0,
      totalPages: 0,
      loading: false,
      error: null,
      goToPage: vi.fn(),
      changePageSize: vi.fn(),
      refreshTasks: vi.fn(),
    })),
    useBranchesForDropdown: vi.fn(() => ({
      branches: [{ id: 1, name: 'Branch 1' }],
      loading: false,
      error: null,
    })),
    useDepartmentsForDropdown: vi.fn(() => ({
      departments: [{ id: 1, name: 'Department 1', branch_id: 1 }],
      loading: false,
      error: null,
    })),
    useProgramsForDropdown: vi.fn(() => ({
      programs: mockProgramsResponse.data,
      loading: false,
      error: null,
      refreshError: null,
      refresh: mockRefreshPrograms,
      hasCachedData: true,
    })),
    useIPPhonesForDropdown: vi.fn(() => ({
      ipPhones: mockIPPhonesResponse.data,
      loading: false,
      error: null,
      refreshError: null,
      refresh: mockRefreshIPPhones,
      hasCachedData: true,
    })),
    useAssign: vi.fn(() => ({
      assingTo: [{ id: 1, name: 'User 1' }],
      loading: false,
      error: null,
    })),
    addTaskNew: vi.fn(),
    updateTaskNew: vi.fn(),
    deleteTaskNew: vi.fn(),
    mockRefreshIPPhones,
    mockRefreshPrograms,
  }
})

// Mock components
vi.mock('@/components/layout/app-sidebar', () => ({
  AppSidebar: ({ children }: { children?: React.ReactNode }) => <div data-testid="app-sidebar">{children}</div>
}))

vi.mock('@/components/layout/site-header', () => ({
  SiteHeader: ({ title }: { title: string }) => <div data-testid="site-header">{title}</div>
}))

vi.mock('@/components/ui/sidebar', () => ({
  SidebarProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-provider">{children}</div>,
  SidebarInset: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-inset">{children}</div>
}))

vi.mock('@/components/tables/tasks-new-table', () => ({
  TasksNewTable: () => <div data-testid="tasks-table">Tasks Table</div>
}))

vi.mock('@/components/pagination/pagination-wrapper', () => ({
  PaginationWrapper: () => <div data-testid="pagination-wrapper">Pagination</div>
}))

vi.mock('@/components/error-boundary/pagination-error-boundary', () => ({
  PaginationErrorBoundary: ({ children }: { children: React.ReactNode }) => <div data-testid="error-boundary">{children}</div>
}))

describe('Integration Tests - Complete Refresh Flow', () => {
  let mockRefreshIPPhones: any
  let mockRefreshPrograms: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Get the mock functions
    const apiModule = require('@/api/route')
    mockRefreshIPPhones = vi.fn()
    mockRefreshPrograms = vi.fn()
    
    // Update the mocks to use our spy functions
    apiModule.useIPPhonesForDropdown.mockReturnValue({
      ipPhones: mockIPPhonesResponse.data,
      loading: false,
      error: null,
      refreshError: null,
      refresh: mockRefreshIPPhones,
      hasCachedData: true,
    })

    apiModule.useProgramsForDropdown.mockReturnValue({
      programs: mockProgramsResponse.data,
      loading: false,
      error: null,
      refreshError: null,
      refresh: mockRefreshPrograms,
      hasCachedData: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should complete the full refresh flow when AddTask is clicked', async () => {
    const user = userEvent.setup()
    
    render(<TasksPage />)

    // 1. Click AddTask button
    const addTaskButton = screen.getByRole('button', { name: /AddTask/i })
    await user.click(addTaskButton)

    // 2. Verify refresh functions were called
    expect(mockRefreshIPPhones).toHaveBeenCalledTimes(1)
    expect(mockRefreshPrograms).toHaveBeenCalledTimes(1)

    // 3. Verify form opened immediately
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    // 4. Verify form shows the data
    expect(screen.getByText('Add New Task')).toBeInTheDocument()
    
    // 5. Verify dropdowns contain the expected data
    const ipPhoneSelect = screen.getByRole('combobox', { name: /ip phone/i })
    fireEvent.click(ipPhoneSelect)
    expect(screen.getByText('101 - Phone 1')).toBeInTheDocument()
    expect(screen.getByText('102 - Phone 2')).toBeInTheDocument()

    // Close IP phone dropdown and open program dropdown
    fireEvent.click(ipPhoneSelect)
    const programSelect = screen.getByRole('combobox', { name: /program/i })
    fireEvent.click(programSelect)
    expect(screen.getByText('Program 1')).toBeInTheDocument()
    expect(screen.getByText('Program 2')).toBeInTheDocument()
  })

  it('should handle refresh with loading states', async () => {
    const user = userEvent.setup()
    
    // Mock loading states
    const apiModule = require('@/api/route')
    apiModule.useIPPhonesForDropdown.mockReturnValue({
      ipPhones: mockIPPhonesResponse.data,
      loading: true,
      error: null,
      refreshError: null,
      refresh: mockRefreshIPPhones,
      hasCachedData: true,
    })

    apiModule.useProgramsForDropdown.mockReturnValue({
      programs: mockProgramsResponse.data,
      loading: true,
      error: null,
      refreshError: null,
      refresh: mockRefreshPrograms,
      hasCachedData: true,
    })
    
    render(<TasksPage />)

    const addTaskButton = screen.getByRole('button', { name: /AddTask/i })
    await user.click(addTaskButton)

    // Form should open with loading states
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    // Should show loading overlay
    expect(screen.getByText('Refreshing form data...')).toBeInTheDocument()
    
    // Should show loading in dropdowns
    expect(screen.getByText('Loading IP phones...')).toBeInTheDocument()
    expect(screen.getByText('Loading programs...')).toBeInTheDocument()
  })

  it('should handle refresh errors gracefully', async () => {
    const user = userEvent.setup()
    
    // Mock error states
    const apiModule = require('@/api/route')
    apiModule.useIPPhonesForDropdown.mockReturnValue({
      ipPhones: mockIPPhonesResponse.data,
      loading: false,
      error: null,
      refreshError: 'IP phones refresh failed',
      refresh: mockRefreshIPPhones,
      hasCachedData: true,
    })

    apiModule.useProgramsForDropdown.mockReturnValue({
      programs: mockProgramsResponse.data,
      loading: false,
      error: null,
      refreshError: 'Programs refresh failed',
      refresh: mockRefreshPrograms,
      hasCachedData: true,
    })
    
    render(<TasksPage />)

    const addTaskButton = screen.getByRole('button', { name: /AddTask/i })
    await user.click(addTaskButton)

    // Form should still open
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    // Should show error messages with cached data warnings
    expect(screen.getByText('⚠️ IP phones refresh failed - showing cached data')).toBeInTheDocument()
    expect(screen.getByText('⚠️ Programs refresh failed - showing cached data')).toBeInTheDocument()
    
    // Should still show cached data in dropdowns
    const ipPhoneSelect = screen.getByRole('combobox', { name: /ip phone/i })
    fireEvent.click(ipPhoneSelect)
    expect(screen.getByText('101 - Phone 1')).toBeInTheDocument()
  })

  it('should maintain filter functionality after refresh', async () => {
    const user = userEvent.setup()
    
    render(<TasksPage />)

    // 1. Open filters first
    const filterButton = screen.getByRole('button', { name: /ตัวกรอง/i })
    await user.click(filterButton)

    // Verify filters are visible
    expect(screen.getByText('สาขา')).toBeInTheDocument()
    expect(screen.getByText('แผนก')).toBeInTheDocument()

    // 2. Click AddTask (which triggers refresh)
    const addTaskButton = screen.getByRole('button', { name: /AddTask/i })
    await user.click(addTaskButton)

    // 3. Verify refresh was called
    expect(mockRefreshIPPhones).toHaveBeenCalledTimes(1)
    expect(mockRefreshPrograms).toHaveBeenCalledTimes(1)

    // 4. Verify filters are still visible and functional
    expect(screen.getByText('สาขา')).toBeInTheDocument()
    expect(screen.getByText('แผนก')).toBeInTheDocument()
    expect(screen.getByText('โปรแกรม')).toBeInTheDocument()
    expect(screen.getByText('สถานะ')).toBeInTheDocument()

    // 5. Close form and verify filters still work
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    // Filters should still be there
    expect(screen.getByText('สาขา')).toBeInTheDocument()
  })

  it('should allow form submission after successful refresh', async () => {
    const user = userEvent.setup()
    const mockAddTaskNew = vi.fn().mockResolvedValue({ success: true })
    
    const apiModule = require('@/api/route')
    apiModule.addTaskNew.mockImplementation(mockAddTaskNew)
    
    render(<TasksPage />)

    // Click AddTask
    const addTaskButton = screen.getByRole('button', { name: /AddTask/i })
    await user.click(addTaskButton)

    // Wait for form to open
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    // Fill out the form
    const textArea = screen.getByRole('textbox', { name: /text/i })
    await user.type(textArea, 'Test task description')

    // Select a program
    const programSelect = screen.getByRole('combobox', { name: /program/i })
    fireEvent.click(programSelect)
    const programOption = screen.getByText('Program 1')
    fireEvent.click(programOption)

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create task/i })
    await user.click(submitButton)

    // Verify the API was called
    expect(mockAddTaskNew).toHaveBeenCalledWith({
      phone_id: null,
      system_id: 1,
      text: 'Test task description',
      status: 0,
      assign_to: null,
      telegram: true,
    })
  })
})