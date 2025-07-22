import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DepartmentSummarySection } from '../department-summary-section'
import type { TaskWithPhone } from '@/types/entities'

const mockTasks: TaskWithPhone[] = [
  {
    id: 1,
    phone_id: 1,
    text: 'Login system not working',
    status: 1,
    branch_id: 1,
    department_id: 1,
    branch_name: 'Main Office',
    department_name: 'IT Department',
    number: 1001,
    phone_name: 'IT Phone 1',
    system_id: 1,
    system_name: 'Authentication System'
  },
  {
    id: 2,
    phone_id: 2,
    text: 'Database connection timeout',
    status: 0,
    branch_id: 1,
    department_id: 1,
    branch_name: 'Main Office',
    department_name: 'IT Department',
    number: 1002,
    phone_name: 'IT Phone 2',
    system_id: 1,
    system_name: 'Authentication System'
  },
  {
    id: 3,
    phone_id: 3,
    text: 'Email notifications not sending',
    status: 1,
    branch_id: 2,
    department_id: 2,
    branch_name: 'Branch Office',
    department_name: 'HR Department',
    number: 2001,
    phone_name: 'HR Phone 1',
    system_id: 2,
    system_name: 'Email System'
  }
]

// Mock window dimensions for tooltip positioning
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
})

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
})

describe('DepartmentSummarySection', () => {
  it('should render loading state correctly', () => {
    render(<DepartmentSummarySection tasks={[]} loading={true} />)
    
    expect(screen.getByText('Department Summary')).toBeInTheDocument()
    expect(screen.getAllByRole('generic')).toHaveLength(expect.any(Number))
    
    // Check for loading skeleton elements
    const skeletonElements = document.querySelectorAll('.animate-pulse')
    expect(skeletonElements.length).toBeGreaterThan(0)
  })

  it('should render error state correctly', () => {
    const errorMessage = 'Failed to load department data'
    render(
      <DepartmentSummarySection 
        tasks={[]} 
        loading={false} 
        error={errorMessage} 
      />
    )
    
    expect(screen.getByText('Department Summary')).toBeInTheDocument()
    expect(screen.getByText('Error Loading Department Data')).toBeInTheDocument()
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('should render empty state when no tasks exist', () => {
    render(<DepartmentSummarySection tasks={[]} loading={false} />)
    
    expect(screen.getByText('Department Summary')).toBeInTheDocument()
    expect(screen.getByText('No Department Data')).toBeInTheDocument()
    expect(screen.getByText('No problems have been reported for any departments yet.')).toBeInTheDocument()
  })

  it('should render department cards with task data', () => {
    render(<DepartmentSummarySection tasks={mockTasks} loading={false} />)
    
    expect(screen.getByText('Department Summary')).toBeInTheDocument()
    expect(screen.getByText('IT Department')).toBeInTheDocument()
    expect(screen.getByText('HR Department')).toBeInTheDocument()
    expect(screen.getByText('Main Office')).toBeInTheDocument()
    expect(screen.getByText('Branch Office')).toBeInTheDocument()
  })

  it('should display overview statistics correctly', () => {
    render(<DepartmentSummarySection tasks={mockTasks} loading={false} />)
    
    expect(screen.getByText('2 branches')).toBeInTheDocument()
    expect(screen.getByText('2 departments')).toBeInTheDocument()
    expect(screen.getByText('~1 avg problems')).toBeInTheDocument() // (2+1)/2 = 1.5 rounded to 1
  })

  it('should handle hover interactions correctly', async () => {
    render(<DepartmentSummarySection tasks={mockTasks} loading={false} />)
    
    const itDepartmentCard = screen.getByText('IT Department').closest('[role="button"]')
    expect(itDepartmentCard).toBeInTheDocument()
    
    // Hover over the card
    fireEvent.mouseEnter(itDepartmentCard!)
    
    // Wait for tooltip to appear
    await waitFor(() => {
      expect(screen.getByText('IT Department Problems')).toBeInTheDocument()
    })
    
    // Leave the card
    fireEvent.mouseLeave(itDepartmentCard!)
    
    // Tooltip should disappear after delay
    await waitFor(() => {
      expect(screen.queryByText('IT Department Problems')).not.toBeInTheDocument()
    }, { timeout: 200 })
  })

  it('should sort departments by problem count', () => {
    render(<DepartmentSummarySection tasks={mockTasks} loading={false} />)
    
    const departmentCards = screen.getAllByText(/Department/).filter(el => 
      el.textContent?.includes('IT Department') || el.textContent?.includes('HR Department')
    )
    
    // IT Department should come first (2 problems vs 1 problem)
    expect(departmentCards[0]).toHaveTextContent('IT Department')
  })

  it('should handle processing errors gracefully', () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    // Create malformed task data that might cause processing errors
    const malformedTasks = [
      {
        id: null,
        department_id: null,
        system_id: null
      }
    ] as any
    
    render(<DepartmentSummarySection tasks={malformedTasks} loading={false} />)
    
    // Should show empty state instead of crashing
    expect(screen.getByText('No Department Data')).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })

  it('should be responsive and handle different screen sizes', () => {
    render(<DepartmentSummarySection tasks={mockTasks} loading={false} />)
    
    const gridContainer = document.querySelector('.grid')
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3')
  })

  it('should handle keyboard navigation on department cards', () => {
    render(<DepartmentSummarySection tasks={mockTasks} loading={false} />)
    
    const itDepartmentCard = screen.getByText('IT Department').closest('[role="button"]')
    expect(itDepartmentCard).toBeInTheDocument()
    expect(itDepartmentCard).toHaveAttribute('tabIndex', '0')
    
    // Test keyboard interaction
    fireEvent.keyDown(itDepartmentCard!, { key: 'Enter' })
    
    // Should trigger hover behavior
    expect(screen.getByText('IT Department Problems')).toBeInTheDocument()
  })

  it('should calculate statistics correctly with various data', () => {
    const complexTasks: TaskWithPhone[] = [
      ...mockTasks,
      {
        id: 4,
        phone_id: 4,
        text: 'Another problem',
        status: 1,
        branch_id: 3,
        department_id: 3,
        branch_name: 'Third Branch',
        department_name: 'Finance Department',
        number: 3001,
        phone_name: 'Finance Phone',
        system_id: 3,
        system_name: 'Finance System'
      }
    ]
    
    render(<DepartmentSummarySection tasks={complexTasks} loading={false} />)
    
    expect(screen.getByText('3 branches')).toBeInTheDocument()
    expect(screen.getByText('3 departments')).toBeInTheDocument()
    expect(screen.getByText('~1 avg problems')).toBeInTheDocument() // (2+1+1)/3 = 1.33 rounded to 1
  })
})