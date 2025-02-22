const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

export const API_ROUTES = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // Employees
  EMPLOYEES: `${API_BASE_URL}/employees`,
  EMPLOYEE: (id: number) => `${API_BASE_URL}/employees/${id}`,
  
  // Departments
  DEPARTMENTS: `${API_BASE_URL}/departments`,
  DEPARTMENT: (id: number) => `${API_BASE_URL}/departments/${id}`,
  
  // ShiftWeeks
  SHIFT_WEEKS: `${API_BASE_URL}/shiftweeks`,
  SHIFT_WEEK: (id: number) => `${API_BASE_URL}/shiftweeks/${id}`,
  SHIFT_WEEKS_BY_DEPARTMENT: (departmentId: number) => `${API_BASE_URL}/shiftweeks/department/${departmentId}`,
  SHIFT_WEEK_STATUS: (id: number) => `${API_BASE_URL}/shiftweeks/${id}/status`,
  SHIFT_WEEK_STATS: (id: number) => `${API_BASE_URL}/shiftweeks/${id}/stats`,
  
  // ShiftDays
  SHIFT_DAYS: `${API_BASE_URL}/shiftdays`,
  SHIFT_DAY: (id: number) => `${API_BASE_URL}/shiftdays/${id}`,
  SHIFT_DAYS_BY_WEEK: (weekId: number) => `${API_BASE_URL}/shiftdays/week/${weekId}`,
  SHIFT_DAYS_BY_EMPLOYEE: (employeeId: number) => `${API_BASE_URL}/shiftdays/employee/${employeeId}`,
  SHIFT_DAYS_BY_DEPARTMENT: (departmentId: number) => `${API_BASE_URL}/shiftdays/department/${departmentId}`,

  // ShiftTypes
  SHIFTTYPES: `${API_BASE_URL}/shifttypes`,
  SHIFTTYPE: (id: number) => `${API_BASE_URL}/shifttypes/${id}`,
}

export const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
}

export default API_ROUTES
