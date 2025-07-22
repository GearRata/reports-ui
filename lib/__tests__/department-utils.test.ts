import {
  groupTasksByDepartment,
  groupTasksByProgram,
  createProgramSummaries,
  findTopProgramByDepartment,
  calculateDepartmentSummaries,
  getStatusText,
  getStatusColor,
  truncateText
} from '../department-utils'
import type { TaskWithPhone } from '@/types/entities'

// Mock task data for testing
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
    branch_id: 1,
    department_id: 2,
    branch_name: 'Main Office',
    department_name: 'HR Department',
    number: 2001,
    phone_name: 'HR Phone 1',
    system_id: 2,
    system_name: 'Email System'
  },
  {
    id: 4,
    phone_id: 4,
    text: 'Report generation failing',
    status: 1,
    branch_id: 2,
    department_id: 3,
    branch_name: 'Branch Office',
    department_name: 'Finance Department',
    number: 3001,
    phone_name: 'Finance Phone 1',
    system_id: 3,
    system_name: 'Reporting System'
  }
]

describe('department-utils', () => {
  describe('groupTasksByDepartment', () => {
    it('should group tasks by department ID', () => {
      const result = groupTasksByDepartment(mockTasks)
      
      expect(result.size).toBe(3)
      expect(result.get(1)).toHaveLength(2)
      expect(result.get(2)).toHaveLength(1)
      expect(result.get(3)).toHaveLength(1)
    })

    it('should handle empty task array', () => {
      const result = groupTasksByDepartment([])
      expect(result.size).toBe(0)
    })

    it('should handle tasks without department_id', () => {
      const tasksWithoutDept = [
        { ...mockTasks[0], department_id: undefined } as any
      ]
      const result = groupTasksByDepartment(tasksWithoutDept)
      expect(result.size).toBe(0)
    })
  })

  describe('groupTasksByProgram', () => {
    it('should group tasks by system ID', () => {
      const result = groupTasksByProgram(mockTasks)
      
      expect(result.size).toBe(3)
      expect(result.get(1)).toHaveLength(2) // Authentication System
      expect(result.get(2)).toHaveLength(1) // Email System
      expect(result.get(3)).toHaveLength(1) // Reporting System
    })

    it('should handle empty task array', () => {
      const result = groupTasksByProgram([])
      expect(result.size).toBe(0)
    })
  })

  describe('createProgramSummaries', () => {
    it('should create program summaries sorted by problem count', () => {
      const programMap = groupTasksByProgram(mockTasks)
      const result = createProgramSummaries(programMap)
      
      expect(result).toHaveLength(3)
      expect(result[0].programName).toBe('Authentication System')
      expect(result[0].problemCount).toBe(2)
      expect(result[1].problemCount).toBe(1)
      expect(result[2].problemCount).toBe(1)
    })

    it('should handle empty program map', () => {
      const result = createProgramSummaries(new Map())
      expect(result).toHaveLength(0)
    })
  })

  describe('findTopProgramByDepartment', () => {
    it('should find program with most problems in department', () => {
      const itDeptTasks = mockTasks.filter(t => t.department_id === 1)
      const result = findTopProgramByDepartment(itDeptTasks)
      
      expect(result).toBeDefined()
      expect(result?.programName).toBe('Authentication System')
      expect(result?.problemCount).toBe(2)
    })

    it('should return undefined for empty task array', () => {
      const result = findTopProgramByDepartment([])
      expect(result).toBeUndefined()
    })

    it('should handle single task', () => {
      const singleTask = [mockTasks[2]]
      const result = findTopProgramByDepartment(singleTask)
      
      expect(result).toBeDefined()
      expect(result?.programName).toBe('Email System')
      expect(result?.problemCount).toBe(1)
    })
  })

  describe('calculateDepartmentSummaries', () => {
    it('should calculate comprehensive department summaries', () => {
      const result = calculateDepartmentSummaries(mockTasks)
      
      expect(result).toHaveLength(3)
      
      // Should be sorted by total problems (descending)
      expect(result[0].departmentName).toBe('IT Department')
      expect(result[0].totalProblems).toBe(2)
      expect(result[0].branchName).toBe('Main Office')
      expect(result[0].topProgram?.programName).toBe('Authentication System')
      
      expect(result[1].totalProblems).toBe(1)
      expect(result[2].totalProblems).toBe(1)
    })

    it('should handle empty task array', () => {
      const result = calculateDepartmentSummaries([])
      expect(result).toHaveLength(0)
    })

    it('should handle tasks with missing data gracefully', () => {
      const incompleteTask: TaskWithPhone = {
        id: 5,
        phone_id: 5,
        text: 'Test problem',
        status: 1,
        branch_id: 0,
        department_id: 4,
        branch_name: '',
        department_name: '',
        number: 4001,
        phone_name: 'Test Phone',
        system_id: 4,
        system_name: ''
      }
      
      const result = calculateDepartmentSummaries([incompleteTask])
      
      expect(result).toHaveLength(1)
      expect(result[0].departmentName).toBe('Department 4')
      expect(result[0].branchName).toBe('Unknown Branch')
      expect(result[0].topProgram?.programName).toBe('Program 4')
    })
  })

  describe('getStatusText', () => {
    it('should return correct status text', () => {
      expect(getStatusText(0)).toBe('Solved')
      expect(getStatusText(1)).toBe('Pending')
    })
  })

  describe('getStatusColor', () => {
    it('should return correct status color classes', () => {
      expect(getStatusColor(0)).toBe('text-green-600')
      expect(getStatusColor(1)).toBe('text-orange-600')
    })
  })

  describe('truncateText', () => {
    it('should truncate long text with ellipsis', () => {
      const longText = 'This is a very long text that should be truncated'
      const result = truncateText(longText, 20)
      
      expect(result).toBe('This is a very long ...')
      expect(result.length).toBe(23) // 20 + '...'
    })

    it('should not truncate short text', () => {
      const shortText = 'Short text'
      const result = truncateText(shortText, 20)
      
      expect(result).toBe('Short text')
    })

    it('should use default max length of 50', () => {
      const text = 'A'.repeat(60)
      const result = truncateText(text)
      
      expect(result.length).toBe(53) // 50 + '...'
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle tied problem counts correctly', () => {
      const tiedTasks: TaskWithPhone[] = [
        { ...mockTasks[0], department_id: 1, system_id: 1 },
        { ...mockTasks[1], department_id: 1, system_id: 2 }
      ]
      
      const result = findTopProgramByDepartment(tiedTasks)
      expect(result).toBeDefined()
      expect(result?.problemCount).toBe(1)
    })

    it('should handle null/undefined values in task data', () => {
      const taskWithNulls = {
        ...mockTasks[0],
        department_name: null,
        branch_name: null,
        system_name: null
      } as any
      
      const result = calculateDepartmentSummaries([taskWithNulls])
      expect(result).toHaveLength(1)
      expect(result[0].departmentName).toContain('Department')
      expect(result[0].branchName).toBe('Unknown Branch')
    })
  })
})