import { render, screen } from '@testing-library/react'
import { ProblemTooltip } from '../problem-tooltip'
import type { DepartmentSummary } from '@/lib/department-utils'
import type { TaskWithPhone } from '@/types/entities'

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

const mockProblems: TaskWithPhone[] = [
  {
    id: 1,
    phone_id: 1,
    text: 'Login system not working properly',
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
    text: 'Database connection timeout error',
    status: 0,
    branch_id: 1,
    department_id: 1,
    branch_name: 'Main Office',
    department_name: 'IT Department',
    number: 1002,
    phone_name: 'IT Phone 2',
    system_id: 1,
    system_name: 'Authentication System'
  }
]

const mockDepartment: DepartmentSummary = {
  departmentId: 1,
  departmentName: 'IT Department',
  branchId: 1,
  branchName: 'Main Office',
  totalProblems: 2,
  programs: [
    {
      programId: 1,
      programName: 'Authentication System',
      problemCount: 2,
      problems: mockProblems
    }
  ],
  allProblems: mockProblems,
  topProgram: {
    programId: 1,
    programName: 'Authentication System',
    problemCount: 2,
    problems: mockProblems
  }
}

const mockEmptyDepartment: DepartmentSummary = {
  departmentId: 2,
  departmentName: 'Empty Department',
  branchId: 1,
  branchName: 'Main Office',
  totalProblems: 0,
  programs: [],
  allProblems: [],
  topProgram: undefined
}

describe('ProblemTooltip', () => {
  it('should not render when not visible', () => {
    const { container } = render(
      <ProblemTooltip
        department={mockDepartment}
        isVisible={false}
        position={{ x: 100, y: 100 }}
      />
    )
    
    expect(container.firstChild).toBeNull()
  })

  it('should render department information when visible', () => {
    render(
      <ProblemTooltip
        department={mockDepartment}
        isVisible={true}
        position={{ x: 100, y: 100 }}
      />
    )
    
    expect(screen.getByText('IT Department Problems')).toBeInTheDocument()
    expect(screen.getByText('Main Office • 2 total problems')).toBeInTheDocument()
  })

  it('should display program information and problems', () => {
    render(
      <ProblemTooltip
        department={mockDepartment}
        isVisible={true}
        position={{ x: 100, y: 100 }}
      />
    )
    
    expect(screen.getByText('Authentication System')).toBeInTheDocument()
    expect(screen.getByText('2 issues')).toBeInTheDocument()
    expect(screen.getByText(/Login system not working/)).toBeInTheDocument()
    expect(screen.getByText(/Database connection timeout/)).toBeInTheDocument()
  })

  it('should show problem status correctly', () => {
    render(
      <ProblemTooltip
        department={mockDepartment}
        isVisible={true}
        position={{ x: 100, y: 100 }}
      />
    )
    
    expect(screen.getByText('Pending:')).toBeInTheDocument()
    expect(screen.getByText('Solved:')).toBeInTheDocument()
  })

  it('should display summary statistics in footer', () => {
    render(
      <ProblemTooltip
        department={mockDepartment}
        isVisible={true}
        position={{ x: 100, y: 100 }}
      />
    )
    
    expect(screen.getByText('1 programs affected')).toBeInTheDocument()
    expect(screen.getByText('1 solved')).toBeInTheDocument()
    expect(screen.getByText('1 pending')).toBeInTheDocument()
  })

  it('should handle empty department correctly', () => {
    render(
      <ProblemTooltip
        department={mockEmptyDepartment}
        isVisible={true}
        position={{ x: 100, y: 100 }}
      />
    )
    
    expect(screen.getByText('Empty Department Problems')).toBeInTheDocument()
    expect(screen.getByText('No problems reported')).toBeInTheDocument()
  })

  it('should truncate long problem descriptions', () => {
    const longProblemDepartment: DepartmentSummary = {
      ...mockDepartment,
      programs: [
        {
          programId: 1,
          programName: 'Test System',
          problemCount: 1,
          problems: [
            {
              ...mockProblems[0],
              text: 'This is a very long problem description that should be truncated to prevent the tooltip from becoming too wide and overwhelming'
            }
          ]
        }
      ]
    }
    
    render(
      <ProblemTooltip
        department={longProblemDepartment}
        isVisible={true}
        position={{ x: 100, y: 100 }}
      />
    )
    
    const truncatedText = screen.getByText(/This is a very long problem/)
    expect(truncatedText.textContent).toContain('...')
  })

  it('should limit displayed problems to 3 per program', () => {
    const manyProblemsProgram = {
      programId: 1,
      programName: 'Test System',
      problemCount: 5,
      problems: [
        { ...mockProblems[0], id: 1, text: 'Problem 1' },
        { ...mockProblems[0], id: 2, text: 'Problem 2' },
        { ...mockProblems[0], id: 3, text: 'Problem 3' },
        { ...mockProblems[0], id: 4, text: 'Problem 4' },
        { ...mockProblems[0], id: 5, text: 'Problem 5' }
      ]
    }
    
    const departmentWithManyProblems: DepartmentSummary = {
      ...mockDepartment,
      programs: [manyProblemsProgram],
      totalProblems: 5
    }
    
    render(
      <ProblemTooltip
        department={departmentWithManyProblems}
        isVisible={true}
        position={{ x: 100, y: 100 }}
      />
    )
    
    expect(screen.getByText('Problem 1')).toBeInTheDocument()
    expect(screen.getByText('Problem 2')).toBeInTheDocument()
    expect(screen.getByText('Problem 3')).toBeInTheDocument()
    expect(screen.getByText('+2 more problems')).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(
      <ProblemTooltip
        department={mockDepartment}
        isVisible={true}
        position={{ x: 100, y: 100 }}
      />
    )
    
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveAttribute('aria-live', 'polite')
    expect(tooltip).toHaveAttribute('aria-label')
    expect(tooltip.getAttribute('aria-label')).toContain('IT Department')
  })

  it('should position tooltip within viewport bounds', () => {
    const { container } = render(
      <ProblemTooltip
        department={mockDepartment}
        isVisible={true}
        position={{ x: 900, y: 700 }}
      />
    )
    
    const tooltipElement = container.firstChild as HTMLElement
    expect(tooltipElement.style.position).toBe('fixed')
    expect(parseInt(tooltipElement.style.left)).toBeLessThan(window.innerWidth)
    expect(parseInt(tooltipElement.style.top)).toBeLessThan(window.innerHeight)
  })
})