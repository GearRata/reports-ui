import { render, screen, fireEvent } from '@testing-library/react'
import { DepartmentSummaryCard } from '../department-summary-card'
import type { DepartmentSummary } from '@/lib/department-utils'

// Mock department data for testing
const mockDepartment: DepartmentSummary = {
  departmentId: 1,
  departmentName: 'IT Department',
  branchId: 1,
  branchName: 'Main Office',
  totalProblems: 5,
  programs: [
    {
      programId: 1,
      programName: 'Authentication System',
      problemCount: 3,
      problems: []
    },
    {
      programId: 2,
      programName: 'Email System',
      problemCount: 2,
      problems: []
    }
  ],
  allProblems: [],
  topProgram: {
    programId: 1,
    programName: 'Authentication System',
    problemCount: 3,
    problems: []
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

describe('DepartmentSummaryCard', () => {
  it('should render department information correctly', () => {
    render(<DepartmentSummaryCard department={mockDepartment} />)
    
    expect(screen.getByText('IT Department')).toBeInTheDocument()
    expect(screen.getByText('Main Office')).toBeInTheDocument()
    expect(screen.getByText('5 problems')).toBeInTheDocument()
  })

  it('should display top program information', () => {
    render(<DepartmentSummaryCard department={mockDepartment} />)
    
    expect(screen.getByText('Most Problematic Program')).toBeInTheDocument()
    expect(screen.getByText('Authentication System')).toBeInTheDocument()
    expect(screen.getByText('3 issues')).toBeInTheDocument()
  })

  it('should show other programs when multiple programs exist', () => {
    render(<DepartmentSummaryCard department={mockDepartment} />)
    
    expect(screen.getByText('Other Programs (1)')).toBeInTheDocument()
    expect(screen.getByText('Email System')).toBeInTheDocument()
  })

  it('should handle hover events correctly', () => {
    const mockOnHover = jest.fn()
    const mockOnLeave = jest.fn()
    
    render(
      <DepartmentSummaryCard 
        department={mockDepartment}
        onHover={mockOnHover}
        onLeave={mockOnLeave}
      />
    )
    
    const card = screen.getByRole('button')
    
    fireEvent.mouseEnter(card)
    expect(mockOnHover).toHaveBeenCalledWith(mockDepartment, expect.any(Object))
    
    fireEvent.mouseLeave(card)
    expect(mockOnLeave).toHaveBeenCalled()
  })

  it('should handle keyboard navigation', () => {
    const mockOnHover = jest.fn()
    
    render(
      <DepartmentSummaryCard 
        department={mockDepartment}
        onHover={mockOnHover}
      />
    )
    
    const card = screen.getByRole('button')
    
    fireEvent.keyDown(card, { key: 'Enter' })
    expect(mockOnHover).toHaveBeenCalled()
    
    fireEvent.keyDown(card, { key: ' ' })
    expect(mockOnHover).toHaveBeenCalledTimes(2)
  })

  it('should display empty state when no problems exist', () => {
    render(<DepartmentSummaryCard department={mockEmptyDepartment} />)
    
    expect(screen.getByText('No problems reported')).toBeInTheDocument()
    expect(screen.getByText('0 problems')).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(<DepartmentSummaryCard department={mockDepartment} />)
    
    const card = screen.getByRole('button')
    expect(card).toHaveAttribute('tabIndex', '0')
    expect(card).toHaveAttribute('aria-label')
    expect(card.getAttribute('aria-label')).toContain('IT Department')
    expect(card.getAttribute('aria-label')).toContain('Main Office')
    expect(card.getAttribute('aria-label')).toContain('5 problems')
  })

  it('should show hover indicator text on hover', () => {
    render(<DepartmentSummaryCard department={mockDepartment} />)
    
    expect(screen.getByText('Hover for problem details')).toBeInTheDocument()
  })

  it('should handle department with many programs correctly', () => {
    const departmentWithManyPrograms: DepartmentSummary = {
      ...mockDepartment,
      programs: [
        { programId: 1, programName: 'Program 1', problemCount: 5, problems: [] },
        { programId: 2, programName: 'Program 2', problemCount: 3, problems: [] },
        { programId: 3, programName: 'Program 3', problemCount: 2, problems: [] },
        { programId: 4, programName: 'Program 4', problemCount: 1, problems: [] },
        { programId: 5, programName: 'Program 5', problemCount: 1, problems: [] }
      ]
    }
    
    render(<DepartmentSummaryCard department={departmentWithManyPrograms} />)
    
    expect(screen.getByText('Other Programs (4)')).toBeInTheDocument()
    expect(screen.getByText('+2 more programs')).toBeInTheDocument()
  })
})