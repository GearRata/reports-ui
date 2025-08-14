import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskNewForm } from '@/components/entities-form'

// Simple integration test for form functionality
describe('Simple Integration Tests', () => {
  const mockIPPhones = [
    { id: 1, number: 101, name: 'Phone 1', branch_id: 1, department_id: 1 },
    { id: 2, number: 102, name: 'Phone 2', branch_id: 1, department_id: 2 }
  ]

  const mockPrograms = [
    { id: 1, name: 'Program 1' },
    { id: 2, name: 'Program 2' }
  ]

  const mockAssignTo = [
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' }
  ]

  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    onSubmit: vi.fn(),
    ipPhones: mockIPPhones,
    programs: mockPrograms,
    assignTo: mockAssignTo,
    ipPhonesLoading: false,
    programsLoading: false,
    ipPhonesError: null,
    programsError: null,
    hasIPPhonesCachedData: false,
    hasProgramsCachedData: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render form with all required elements', () => {
    render(<TaskNewForm {...defaultProps} />)

    // Check that form is rendered
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Add New Task')).toBeInTheDocument()

    // Check that all form fields are present
    expect(screen.getAllByRole('combobox')).toHaveLength(2) // IP phone and program dropdowns
    expect(screen.getByRole('textbox')).toBeInTheDocument() // Text area
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('should handle form submission with valid data', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()

    render(<TaskNewForm {...defaultProps} onSubmit={mockOnSubmit} />)

    // Fill out the form
    const textArea = screen.getByRole('textbox')
    await user.type(textArea, 'Test task description')

    // Select a program (required field)
    const comboboxes = screen.getAllByRole('combobox')
    const programSelect = comboboxes[1] // Second combobox is program
    fireEvent.click(programSelect)
    
    const programOptions = screen.getAllByText('Program 1')
    fireEvent.click(programOptions[0]) // Click the first option

    // Wait for dropdown to close
    await user.click(document.body)

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create task/i })
    await user.click(submitButton)

    // Verify onSubmit was called with correct data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      phone_id: null,
      system_id: 1,
      text: 'Test task description',
      status: 0,
      assign_id: null,
    })
  })

  it('should show loading states correctly', () => {
    render(
      <TaskNewForm
        {...defaultProps}
        ipPhonesLoading={true}
        programsLoading={true}
      />
    )

    // Should show loading indicators
    expect(screen.getAllByText('Loading IP phones...')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Loading programs...')[0]).toBeInTheDocument()
    
    // Submit button should be disabled and show loading
    const submitButton = screen.getByRole('button', { name: /loading/i })
    expect(submitButton).toBeDisabled()
  })

  it('should handle error states gracefully', () => {
    render(
      <TaskNewForm
        {...defaultProps}
        ipPhonesError="Failed to load IP phones"
        programsError="Failed to load programs"
        hasIPPhonesCachedData={false}
        hasProgramsCachedData={false}
        ipPhones={[]}
        programs={[]}
      />
    )

    // Should show error messages
    expect(screen.getByText('❌ Failed to load IP phones: Failed to load IP phones')).toBeInTheDocument()
    expect(screen.getByText('❌ Failed to load programs: Failed to load programs')).toBeInTheDocument()
    
    // Submit button should be disabled when programs can't be loaded
    const submitButton = screen.getByRole('button', { name: /cannot submit/i })
    expect(submitButton).toBeDisabled()
  })

  it('should show cached data warnings when refresh fails', () => {
    render(
      <TaskNewForm
        {...defaultProps}
        ipPhonesError="Refresh failed"
        programsError="Refresh failed"
        hasIPPhonesCachedData={true}
        hasProgramsCachedData={true}
      />
    )

    // Should show cached data warnings
    expect(screen.getByText('⚠️ IP phones refresh failed - showing cached data')).toBeInTheDocument()
    expect(screen.getByText('⚠️ Programs refresh failed - showing cached data')).toBeInTheDocument()
    
    // Should show cached data placeholders
    expect(screen.getByText('Select IP phone (cached data)')).toBeInTheDocument()
    expect(screen.getByText('Select program (cached data)')).toBeInTheDocument()
    
    // Form should still be submittable with cached data
    const submitButton = screen.getByRole('button', { name: /create task/i })
    expect(submitButton).not.toBeDisabled()
  })

  it('should allow form submission with cached data even when refresh fails', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()

    render(
      <TaskNewForm
        {...defaultProps}
        onSubmit={mockOnSubmit}
        ipPhonesError="Refresh failed"
        programsError="Refresh failed"
        hasIPPhonesCachedData={true}
        hasProgramsCachedData={true}
      />
    )

    // Fill out the form
    const textArea = screen.getByRole('textbox')
    await user.type(textArea, 'Test with cached data')

    // Select a program from cached data
    const comboboxes = screen.getAllByRole('combobox')
    const programSelect = comboboxes[1]
    fireEvent.click(programSelect)
    
    const programOptions = screen.getAllByText('Program 1')
    fireEvent.click(programOptions[0]) // Click the first option

    // Wait for dropdown to close
    await user.click(document.body)

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create task/i })
    await user.click(submitButton)

    // Should still submit successfully
    expect(mockOnSubmit).toHaveBeenCalledWith({
      phone_id: null,
      system_id: 1,
      text: 'Test with cached data',
      status: 0,
      assign_id: null,
    })
  })

  it('should prevent submission when required data is missing and no cache available', () => {
    render(
      <TaskNewForm
        {...defaultProps}
        programsError="Failed to load programs"
        hasProgramsCachedData={false}
        programs={[]}
      />
    )

    // Submit button should be disabled
    const submitButton = screen.getByRole('button', { name: /cannot submit/i })
    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent('Cannot Submit - Missing Data')
  })
})