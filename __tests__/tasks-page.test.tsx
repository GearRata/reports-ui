import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TasksPage from '@/app/tasks/page'

// Mock the API hooks
vi.mock('@/api/route', () => ({
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
    programs: [{ id: 1, name: 'Program 1' }],
    loading: false,
    error: null,
    refreshError: null,
    refresh: vi.fn(),
    hasCachedData: false,
  })),
  useIPPhonesForDropdown: vi.fn(() => ({
    ipPhones: [{ id: 1, number: 101, name: 'Phone 1' }],
    loading: false,
    error: null,
    refreshError: null,
    refresh: vi.fn(),
    hasCachedData: false,
  })),
  useAssign: vi.fn(() => ({
    assingTo: [{ id: 1, name: 'User 1' }],
    loading: false,
    error: null,
  })),
  addTaskNew: vi.fn(),
  updateTaskNew: vi.fn(),
  deleteTaskNew: vi.fn(),
}))

// Mock the components that might cause issues
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
  TasksNewTable: ({ onEditTask, onDeleteTask }: { onEditTask: Function, onDeleteTask: Function }) => (
    <div data-testid="tasks-table">
      <button onClick={() => onEditTask({ id: 1 })}>Edit Task</button>
      <button onClick={() => onDeleteTask(1)}>Delete Task</button>
    </div>
  )
}))

vi.mock('@/components/pagination/pagination-wrapper', () => ({
  PaginationWrapper: () => <div data-testid="pagination-wrapper">Pagination</div>
}))

vi.mock('@/components/error-boundary/pagination-error-boundary', () => ({
  PaginationErrorBoundary: ({ children }: { children: React.ReactNode }) => <div data-testid="error-boundary">{children}</div>
}))

describe('Tasks Page - handleAddTask Functionality', () => {
  const mockRefreshIPPhones = vi.fn()
  const mockRefreshPrograms = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup mocks with refresh functions
    const apiModule = vi.mocked(await import('@/api/route'))
    
    apiModule.useIPPhonesForDropdown.mockReturnValue({
      ipPhones: [{ id: 1, number: 101, name: 'Phone 1' }],
      loading: false,
      error: null,
      refreshError: null,
      refresh: mockRefreshIPPhones,
      hasCachedData: false,
    })

    apiModule.useProgramsForDropdown.mockReturnValue({
      programs: [{ id: 1, name: 'Program 1' }],
      loading: false,
      error: null,
      refreshError: null,
      refresh: mockRefreshPrograms,
      hasCachedData: false,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should trigger API refresh when AddTask button is clicked', async () => {
    const user = userEvent.setup()
    
    render(<TasksPage />)

    // Find and click the AddTask button
    const addTaskButton = screen.getByRole('button', { name: /AddTask/i })
    expect(addTaskButton).toBeInTheDocument()

    await user.click(addTaskButton)

    // Verify that refresh functions were called
    expect(mockRefreshIPPhones).toHaveBeenCalledTimes(1)
    expect(mockRefreshPrograms).toHaveBeenCalledTimes(1)
  })

  it('should open form dialog immediately when AddTask is clicked', async () => {
    const user = userEvent.setup()
    
    render(<TasksPage />)

    const addTaskButton = screen.getByRole('button', { name: /AddTask/i })
    await user.click(addTaskButton)

    // The form should be open (we can check for dialog content)
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  it('should open form even if refresh fails', async () => {
    const user = userEvent.setup()
    
    // Mock refresh functions to throw errors
    mockRefreshIPPhones.mockRejectedValueOnce(new Error('IP phones refresh failed'))
    mockRefreshPrograms.mockRejectedValueOnce(new Error('Programs refresh failed'))
    
    render(<TasksPage />)

    const addTaskButton = screen.getByRole('button', { name: /AddTask/i })
    await user.click(addTaskButton)

    // Form should still open despite refresh failures
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    // Refresh functions should still have been called
    expect(mockRefreshIPPhones).toHaveBeenCalledTimes(1)
    expect(mockRefreshPrograms).toHaveBeenCalledTimes(1)
  })

  it('should not wait for refresh to complete before opening form', async () => {
    const user = userEvent.setup()
    
    // Mock refresh functions with delays
    mockRefreshIPPhones.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))
    mockRefreshPrograms.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))
    
    render(<TasksPage />)

    const addTaskButton = screen.getByRole('button', { name: /AddTask/i })
    await user.click(addTaskButton)

    // Form should open immediately, not wait for refresh
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    }, { timeout: 100 }) // Short timeout to ensure it opens quickly

    expect(mockRefreshIPPhones).toHaveBeenCalledTimes(1)
    expect(mockRefreshPrograms).toHaveBeenCalledTimes(1)
  })

  it('should maintain existing filter functionality', async () => {
    const user = userEvent.setup()
    
    render(<TasksPage />)

    // Test that filter functionality works
    const filterButton = screen.getByRole('button', { name: /ตัวกรอง/i })
    await user.click(filterButton)

    // Filter panel should be visible
    await waitFor(() => {
      expect(screen.getByText('สาขา')).toBeInTheDocument()
      expect(screen.getByText('แผนก')).toBeInTheDocument()
      expect(screen.getByText('โปรแกรม')).toBeInTheDocument()
      expect(screen.getByText('สถานะ')).toBeInTheDocument()
    })

    // Now click AddTask and verify filters are still there
    const addTaskButton = screen.getByRole('button', { name: /AddTask/i })
    await user.click(addTaskButton)

    // Filters should still be visible
    expect(screen.getByText('สาขา')).toBeInTheDocument()
    expect(screen.getByText('แผนก')).toBeInTheDocument()
  })

  it('should preserve filter selections when form is opened', async () => {
    const user = userEvent.setup()
    
    render(<TasksPage />)

    // Open filters
    const filterButton = screen.getByRole('button', { name: /ตัวกรอง/i })
    await user.click(filterButton)

    // Select a branch filter (this would normally update state)
    const branchSelect = screen.getByDisplayValue('ทุกสาขา')
    expect(branchSelect).toBeInTheDocument()

    // Click AddTask
    const addTaskButton = screen.getByRole('button', { name: /AddTask/i })
    await user.click(addTaskButton)

    // Filter selections should be preserved (branch select should still be there)
    expect(screen.getByDisplayValue('ทุกสาขา')).toBeInTheDocument()
  })
})