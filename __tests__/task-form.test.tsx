import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskNewForm } from '@/components/entities-form'

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

describe('TaskNewForm - Loading States', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display loading indicators when IP phones are loading', () => {
    render(
      <TaskNewForm
        {...defaultProps}
        ipPhonesLoading={true}
        ipPhones={[]}
      />
    )

    // Check for loading placeholder in IP phone dropdown
    expect(screen.getByText('Loading IP phones...')).toBeInTheDocument()
    
    // Check for loading spinner in dropdown content
    const comboboxes = screen.getAllByRole('combobox')
    const ipPhoneSelect = comboboxes[0]
    fireEvent.click(ipPhoneSelect)
    
    expect(screen.getByText('Loading IP phones...')).toBeInTheDocument()
  })

  it('should display loading indicators when programs are loading', () => {
    render(
      <TaskNewForm
        {...defaultProps}
        programsLoading={true}
        programs={[]}
      />
    )

    // Check for loading placeholder in program dropdown
    expect(screen.getByText('Loading programs...')).toBeInTheDocument()
    
    // Check for loading spinner in dropdown content
    const comboboxes = screen.getAllByRole('combobox')
    const programSelect = comboboxes[1]
    fireEvent.click(programSelect)
    
    expect(screen.getByText('Loading programs...')).toBeInTheDocument()
  })

  it('should show loading overlay when both APIs are loading', () => {
    render(
      <TaskNewForm
        {...defaultProps}
        ipPhonesLoading={true}
        programsLoading={true}
        ipPhones={[]}
        programs={[]}
      />
    )

    // Should show the overlay with loading message
    expect(screen.getByText('Refreshing form data...')).toBeInTheDocument()
    
    // Should show loading spinner in the overlay
    const overlay = screen.getByText('Refreshing form data...').closest('div')
    expect(overlay).toHaveClass('animate-spin')
  })

  it('should disable dropdowns when loading', () => {
    render(
      <TaskNewForm
        {...defaultProps}
        ipPhonesLoading={true}
        programsLoading={true}
        ipPhones={[]}
        programs={[]}
      />
    )

    const comboboxes = screen.getAllByRole('combobox')
    const ipPhoneSelect = comboboxes[0] // First combobox is IP phone
    const programSelect = comboboxes[1] // Second combobox is program

    expect(ipPhoneSelect).toBeDisabled()
    expect(programSelect).toBeDisabled()
  })

  it('should disable submit button when loading', () => {
    render(
      <TaskNewForm
        {...defaultProps}
        ipPhonesLoading={true}
        programsLoading={true}
        ipPhones={[]}
        programs={[]}
      />
    )

    const submitButton = screen.getByRole('button', { name: /loading/i })
    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent('Loading...')
  })

  it('should show error states for IP phones', () => {
    render(
      <TaskNewForm
        {...defaultProps}
        ipPhonesError="Failed to load IP phones"
        hasIPPhonesCachedData={false}
        ipPhones={[]}
      />
    )

    expect(screen.getByText('❌ Failed to load IP phones: Failed to load IP phones')).toBeInTheDocument()
    expect(screen.getByText('Error loading IP phones')).toBeInTheDocument()
  })

  it('should show error states for programs', () => {
    render(
      <TaskNewForm
        {...defaultProps}
        programsError="Failed to load programs"
        hasProgramsCachedData={false}
        programs={[]}
      />
    )

    expect(screen.getByText('❌ Failed to load programs: Failed to load programs')).toBeInTheDocument()
    expect(screen.getByText('Error loading programs')).toBeInTheDocument()
  })

  it('should show cached data warning when refresh fails but cached data exists', () => {
    render(
      <TaskNewForm
        {...defaultProps}
        ipPhonesError="Refresh failed"
        hasIPPhonesCachedData={true}
        programsError="Refresh failed"
        hasProgramsCachedData={true}
      />
    )

    expect(screen.getByText('⚠️ IP phones refresh failed - showing cached data')).toBeInTheDocument()
    expect(screen.getByText('⚠️ Programs refresh failed - showing cached data')).toBeInTheDocument()
    expect(screen.getByText('Select IP phone (cached data)')).toBeInTheDocument()
    expect(screen.getByText('Select program (cached data)')).toBeInTheDocument()
  })

  it('should allow form submission with cached data even if refresh failed', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()

    render(
      <TaskNewForm
        {...defaultProps}
        onSubmit={mockOnSubmit}
        ipPhonesError="Refresh failed"
        hasIPPhonesCachedData={true}
        programsError="Refresh failed"
        hasProgramsCachedData={true}
      />
    )

    // Fill out the form
    const textArea = screen.getByRole('textbox')
    await user.type(textArea, 'Test task')

    // Select program
    const comboboxes = screen.getAllByRole('combobox')
    const programSelect = comboboxes[1]
    fireEvent.click(programSelect)
    const programOption = screen.getByText('Program 1')
    fireEvent.click(programOption)

    // Submit form
    const submitButton = screen.getByRole('button', { name: /create task/i })
    await user.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledWith({
      phone_id: null,
      system_id: 1,
      text: 'Test task',
      status: 0,
      assign_id: null,
    })
  })

  it('should prevent submission when programs failed to load and no cached data', () => {
    render(
      <TaskNewForm
        {...defaultProps}
        programsError="Failed to load programs"
        hasProgramsCachedData={false}
        programs={[]}
      />
    )

    const submitButton = screen.getByRole('button', { name: /cannot submit/i })
    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent('Cannot Submit - Missing Data')
  })

  it('should show cached data indicators in dropdown options', () => {
    render(
      <TaskNewForm
        {...defaultProps}
        ipPhonesError="Refresh failed"
        hasIPPhonesCachedData={true}
        programsError="Refresh failed"
        hasProgramsCachedData={true}
      />
    )

    // Open IP phones dropdown
    const comboboxes = screen.getAllByRole('combobox')
    const ipPhoneSelect = comboboxes[0]
    fireEvent.click(ipPhoneSelect)
    expect(screen.getByText('⚠️')).toBeInTheDocument()
    expect(screen.getByText('Using cached data')).toBeInTheDocument()

    // Close and open programs dropdown
    fireEvent.click(ipPhoneSelect) // Close
    const programSelect = comboboxes[1]
    fireEvent.click(programSelect)
    expect(screen.getAllByText('⚠️')[1]).toBeInTheDocument()
    expect(screen.getAllByText('Using cached data')[1]).toBeInTheDocument()
  })

  it('should handle form submission prevention during loading', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()

    render(
      <TaskNewForm
        {...defaultProps}
        onSubmit={mockOnSubmit}
        ipPhonesLoading={true}
        programsLoading={true}
      />
    )

    // Try to submit form while loading
    const form = screen.getByRole('dialog').querySelector('form')
    if (form) {
      fireEvent.submit(form)
    }

    // onSubmit should not be called
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('should show appropriate loading states in dialog title', () => {
    render(
      <TaskNewForm
        {...defaultProps}
        ipPhonesLoading={true}
        programsLoading={true}
      />
    )

    // Should show loading spinner in title
    const title = screen.getByText('Add New Task')
    const titleContainer = title.closest('div')
    expect(titleContainer?.querySelector('.animate-spin')).toBeInTheDocument()

    // Should show loading message in description
    expect(screen.getAllByText('Refreshing form data...')[0]).toBeInTheDocument()
  })
})