import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TasksPage from '@/app/tasks/page'

// Mock the API hooks with filter data
vi.mock('@/api/route', () => ({
  useTasksNewPaginated: vi.fn(() => ({
    tasks: [
      {
        id: 1,
        number: 1001,
        phone_name: 'Phone 1',
        department_name: 'IT Department',
        system_name: 'System 1',
        text: 'Test task 1',
        status: 0,
        branch_name: 'Main Branch',
        branch_id: 1,
        department_id: 1,
        system_id: 1,
      },
      {
        id: 2,
        number: 1002,
        phone_name: 'Phone 2',
        department_name: 'HR Department',
        system_name: 'System 2',
        text: 'Test task 2',
        status: 1,
        branch_name: 'Branch 2',
        branch_id: 2,
        department_id: 2,
        system_id: 2,
      }
    ],
    currentPage: 1,
    pageSize: 100,
    totalItems: 2,
    totalPages: 1,
    loading: false,
    error: null,
    goToPage: vi.fn(),
    changePageSize: vi.fn(),
    refreshTasks: vi.fn(),
  })),
  useBranchesForDropdown: vi.fn(() => ({
    branches: [
      { id: 1, name: 'Main Branch' },
      { id: 2, name: 'Branch 2' }
    ],
    loading: false,
    error: null,
  })),
  useDepartmentsForDropdown: vi.fn(() => ({
    departments: [
      { id: 1, name: 'IT Department', branch_id: 1 },
      { id: 2, name: 'HR Department', branch_id: 2 }
    ],
    loading: false,
    error: null,
  })),
  useProgramsForDropdown: vi.fn(() => ({
    programs: [
      { id: 1, name: 'System 1' },
      { id: 2, name: 'System 2' }
    ],
    loading: false,
    error: null,
    refreshError: null,
    refresh: vi.fn(),
    hasCachedData: false,
  })),
  useIPPhonesForDropdown: vi.fn(() => ({
    ipPhones: [
      { id: 1, number: 101, name: 'Phone 1' },
      { id: 2, number: 102, name: 'Phone 2' }
    ],
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
  TasksNewTable: ({ tasks }: { tasks: any[] }) => (
    <div data-testid="tasks-table">
      {tasks.map(task => (
        <div key={task.id} data-testid={`task-${task.id}`}>
          {task.text} - {task.branch_name} - {task.department_name} - {task.system_name} - Status: {task.status}
        </div>
      ))}
    </div>
  )
}))

vi.mock('@/components/pagination/pagination-wrapper', () => ({
  PaginationWrapper: () => <div data-testid="pagination-wrapper">Pagination</div>
}))

vi.mock('@/components/error-boundary/pagination-error-boundary', () => ({
  PaginationErrorBoundary: ({ children }: { children: React.ReactNode }) => <div data-testid="error-boundary">{children}</div>
}))

describe('Filter Functionality - Unchanged After Refresh Implementation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display filter controls correctly', async () => {
    const user = userEvent.setup()
    
    render(<TasksPage />)

    // Open filters
    const filterButton = screen.getByRole('button', { name: /ตัวกรอง/i })
    await user.click(filterButton)

    // Verify all filter controls are present
    expect(screen.getByText('สาขา')).toBeInTheDocument()
    expect(screen.getByText('แผนก')).toBeInTheDocument()
    expect(screen.getByText('โปรแกรม')).toBeInTheDocument()
    expect(screen.getByText('สถานะ')).toBeInTheDocument()

    // Verify default selections
    expect(screen.getByDisplayValue('ทุกสาขา')).toBeInTheDocument()
    expect(screen.getByDisplayValue('ทุกแผนก')).toBeInTheDocument()
    expect(screen.getByDisplayValue('ทุกโปรแกรม')).toBeInTheDocument()
    expect(screen.getByDisplayValue('ทุกสถานะ')).toBeInTheDocument()
  })

  it('should filter by search query', async () => {
    const user = userEvent.setup()
    
    render(<TasksPage />)

    // Initially should show both tasks
    expect(screen.getByTestId('task-1')).toBeInTheDocument()
    expect(screen.getByTestId('task-2')).toBeInTheDocument()

    // Search for specific task
    const searchInput = screen.getByPlaceholderText('ค้นหางาน...')
    await user.type(searchInput, 'Test task 1')

    // Should show search badge
    await waitFor(() => {
      expect(screen.getByText('ค้นหา: Test task 1')).toBeInTheDocument()
    })
  })

  it('should filter by branch selection', async () => {
    const user = userEvent.setup()
    
    render(<TasksPage />)

    // Open filters
    const filterButton = screen.getByRole('button', { name: /ตัวกรอง/i })
    await user.click(filterButton)

    // Select a specific branch
    const branchSelect = screen.getByDisplayValue('ทุกสาขา')
    fireEvent.click(branchSelect)
    
    const branchOption = screen.getByText('Main Branch')
    fireEvent.click(branchOption)

    // Should show branch filter badge
    await waitFor(() => {
      expect(screen.getByText('สาขา: Main Branch')).toBeInTheDocument()
    })
  })

  it('should filter by department selection', async () => {
    const user = userEvent.setup()
    
    render(<TasksPage />)

    // Open filters
    const filterButton = screen.getByRole('button', { name: /ตัวกรอง/i })
    await user.click(filterButton)

    // Select a specific department
    const departmentSelect = screen.getByDisplayValue('ทุกแผนก')
    fireEvent.click(departmentSelect)
    
    const departmentOption = screen.getByText('IT Department')
    fireEvent.click(departmentOption)

    // Should show department filter badge
    await waitFor(() => {
      expect(screen.getByText('แผนก: IT Department')).toBeInTheDocument()
    })
  })

  it('should filter by program selection', async () => {
    const user = userEvent.setup()
    
    render(<TasksPage />)

    // Open filters
    const filterButton = screen.getByRole('button', { name: /ตัวกรอง/i })
    await user.click(filterButton)

    // Select a specific program
    const programSelect = screen.getByDisplayValue('ทุกโปรแกรม')
    fireEvent.click(programSelect)
    
    const programOption = screen.getByText('System 1')
    fireEvent.click(programOption)

    // Should show program filter badge
    await waitFor(() => {
      expect(screen.getByText('โปรแกรม: System 1')).toBeInTheDocument()
    })
  })

  it('should filter by status selection', async () => {
    const user = userEvent.setup()
    
    render(<TasksPage />)

    // Open filters
    const filterButton = screen.getByRole('button', { name: /ตัวกรอง/i })
    await user.click(filterButton)

    // Select pending status
    const statusSelect = screen.getByDisplayValue('ทุกสถานะ')
    fireEvent.click(statusSelect)
    
    const statusOption = screen.getByText('รอดำเนินการ')
    fireEvent.click(statusOption)

    // Should show status filter badge
    await waitFor(() => {
      expect(screen.getByText('สถานะ: รอดำเนินการ')).toBeInTheDocument()
    })
  })

  it('should clear all filters when clear button is clicked', async () => {
    const user = userEvent.setup()
    
    render(<TasksPage />)

    // Add some filters first
    const searchInput = screen.getByPlaceholderText('ค้นหางาน...')
    await user.type(searchInput, 'test')

    // Open filters and select branch
    const filterButton = screen.getByRole('button', { name: /ตัวกรอง/i })
    await user.click(filterButton)

    const branchSelect = screen.getByDisplayValue('ทุกสาขา')
    fireEvent.click(branchSelect)
    const branchOption = screen.getByText('Main Branch')
    fireEvent.click(branchOption)

    // Should show filter badges
    await waitFor(() => {
      expect(screen.getByText('ค้นหา: test')).toBeInTheDocument()
      expect(screen.getByText('สาขา: Main Branch')).toBeInTheDocument()
    })

    // Clear all filters
    const clearButton = screen.getByRole('button', { name: /ล้างตัวกรอง/i })
    await user.click(clearButton)

    // Badges should be gone
    await waitFor(() => {
      expect(screen.queryByText('ค้นหา: test')).not.toBeInTheDocument()
      expect(screen.queryByText('สาขา: Main Branch')).not.toBeInTheDocument()
    })

    // Search input should be cleared
    expect(searchInput).toHaveValue('')
  })

  it('should maintain filter state when AddTask is clicked', async () => {
    const user = userEvent.setup()
    
    render(<TasksPage />)

    // Set up some filters
    const searchInput = screen.getByPlaceholderText('ค้นหางาน...')
    await user.type(searchInput, 'test search')

    const filterButton = screen.getByRole('button', { name: /ตัวกรอง/i })
    await user.click(filterButton)

    const branchSelect = screen.getByDisplayValue('ทุกสาขา')
    fireEvent.click(branchSelect)
    const branchOption = screen.getByText('Main Branch')
    fireEvent.click(branchOption)

    // Verify filters are active
    await waitFor(() => {
      expect(screen.getByText('ค้นหา: test search')).toBeInTheDocument()
      expect(screen.getByText('สาขา: Main Branch')).toBeInTheDocument()
    })

    // Click AddTask (which triggers refresh)
    const addTaskButton = screen.getByRole('button', { name: /AddTask/i })
    await user.click(addTaskButton)

    // Wait for form to open
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    // Close the form
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    // Verify filters are still active
    await waitFor(() => {
      expect(screen.getByText('ค้นหา: test search')).toBeInTheDocument()
      expect(screen.getByText('สาขา: Main Branch')).toBeInTheDocument()
    })

    // Verify search input still has value
    expect(searchInput).toHaveValue('test search')
  })

  it('should reset department filter when branch changes', async () => {
    const user = userEvent.setup()
    
    render(<TasksPage />)

    // Open filters
    const filterButton = screen.getByRole('button', { name: /ตัวกรอง/i })
    await user.click(filterButton)

    // Select a department first
    const departmentSelect = screen.getByDisplayValue('ทุกแผนก')
    fireEvent.click(departmentSelect)
    const departmentOption = screen.getByText('IT Department')
    fireEvent.click(departmentOption)

    // Verify department is selected
    await waitFor(() => {
      expect(screen.getByText('แผนก: IT Department')).toBeInTheDocument()
    })

    // Now change branch
    const branchSelect = screen.getByDisplayValue('ทุกสาขา')
    fireEvent.click(branchSelect)
    const branchOption = screen.getByText('Branch 2')
    fireEvent.click(branchOption)

    // Department filter should be reset
    await waitFor(() => {
      expect(screen.queryByText('แผนก: IT Department')).not.toBeInTheDocument()
      expect(screen.getByText('สาขา: Branch 2')).toBeInTheDocument()
    })
  })

  it('should show "no active filters" state initially', () => {
    render(<TasksPage />)

    // Clear filters button should not be visible initially
    expect(screen.queryByRole('button', { name: /ล้างตัวกรอง/i })).not.toBeInTheDocument()
  })

  it('should toggle filter panel visibility', async () => {
    const user = userEvent.setup()
    
    render(<TasksPage />)

    // Initially filters should not be visible
    expect(screen.queryByText('สาขา')).not.toBeInTheDocument()

    // Click to open filters
    const filterButton = screen.getByRole('button', { name: /ตัวกรอง/i })
    await user.click(filterButton)

    // Filters should be visible
    expect(screen.getByText('สาขา')).toBeInTheDocument()
    expect(screen.getByText('แผนก')).toBeInTheDocument()

    // Click to close filters
    await user.click(filterButton)

    // Filters should be hidden
    expect(screen.queryByText('สาขา')).not.toBeInTheDocument()
  })
})