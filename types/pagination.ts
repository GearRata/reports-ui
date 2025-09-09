// Pagination Types

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginationResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

export interface PaginationState<T = any> {
  data: T[]
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  loading: boolean
  error: string | null
}

// Tasks specific pagination types
export interface TasksPaginationParams extends PaginationParams {}

export interface TasksPaginationResponse extends PaginationResponse {
  data: any[] // Can be typed more specifically based on TaskWithPhone
}

export interface TasksPaginationState extends Omit<PaginationState, 'data'> {
  tasks: any[] // Can be typed more specifically based on TaskWithPhone
}

// Programs specific pagination types
export interface ProgramsPaginationParams extends PaginationParams {}

export interface ProgramsPaginationResponse extends PaginationResponse {
  data: any[] // Can be typed more specifically based on Program
}

export interface ProgramsPaginationState extends Omit<PaginationState, 'data'> {
  programs: any[] // Can be typed more specifically based on Program
}

// Departments specific pagination types
export interface DepartmentsPaginationParams extends PaginationParams {}

export interface DepartmentsPaginationResponse extends PaginationResponse {
  data: any[] // Can be typed more specifically based on Department
}

export interface DepartmentsPaginationState extends Omit<PaginationState, 'data'> {
  departments: any[] // Can be typed more specifically based on Department
}

// IP Phones specific pagination types
export interface IPPhonesPaginationParams extends PaginationParams {}

export interface IPPhonesPaginationResponse extends PaginationResponse {
  data: any[] // Can be typed more specifically based on IPPhone
}

export interface IPPhonesPaginationState extends Omit<PaginationState, 'data'> {
  ipPhones: any[] // Can be typed more specifically based on IPPhone
}