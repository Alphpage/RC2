// API Configuration
// Определяем backend URL с fallback
const getApiBaseUrl = () => {
  // Приоритет 1: Environment variable (set in Render)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Приоритет 2: Production backend на Render
  // ВАЖНО: Замените на ваш реальный backend URL!
  if (window.location.hostname.includes('onrender.com')) {
    return 'https://rentcontrol-backend.onrender.com/api';
  }
  
  // Приоритет 3: Localhost для разработки
  return 'http://localhost:3001/api';
};

const API_BASE_URL = getApiBaseUrl();

// Логируем для отладки
console.log('🔌 API Base URL:', API_BASE_URL);

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  ME: `${API_BASE_URL}/auth/me`,

  // Points
  POINTS: `${API_BASE_URL}/points`,
  POINT_BY_ID: (id: string) => `${API_BASE_URL}/points/${id}`,

  // Users
  USERS: `${API_BASE_URL}/users`,
  USER_BY_ID: (id: string) => `${API_BASE_URL}/users/${id}`,

  // Employees
  EMPLOYEES: `${API_BASE_URL}/employees`,
  EMPLOYEE_BY_ID: (id: string) => `${API_BASE_URL}/employees/${id}`,
  EMPLOYEES_BY_POINT: (pointId: string) => `${API_BASE_URL}/employees/point/${pointId}`,

  // Registers
  REGISTERS: `${API_BASE_URL}/registers`,
  REGISTER_BY_ID: (id: string) => `${API_BASE_URL}/registers/${id}`,
  REGISTERS_BY_POINT: (pointId: string) => `${API_BASE_URL}/registers/point/${pointId}`,

  // Schedules
  POINT_SCHEDULES: `${API_BASE_URL}/schedules/points`,
  POINT_SCHEDULE_BY_ID: (id: string) => `${API_BASE_URL}/schedules/points/${id}`,
  POINT_SCHEDULES_BY_DATE: (pointId: string, date: string) => 
    `${API_BASE_URL}/schedules/points/query?pointId=${pointId}&date=${date}`,
  
  EMPLOYEE_SCHEDULES: `${API_BASE_URL}/schedules/employees`,
  EMPLOYEE_SCHEDULE_BY_ID: (id: string) => `${API_BASE_URL}/schedules/employees/${id}`,
  EMPLOYEE_SCHEDULES_BY_DATE: (employeeId: string, date: string) => 
    `${API_BASE_URL}/schedules/employees/query?employeeId=${employeeId}&date=${date}`,

  // Revenue
  REVENUE: `${API_BASE_URL}/revenue`,
  REVENUE_BY_ID: (id: string) => `${API_BASE_URL}/revenue/${id}`,
  REVENUE_BY_POINT_DATE: (pointId: string, date: string) => 
    `${API_BASE_URL}/revenue/query?pointId=${pointId}&date=${date}`,

  // Encashment
  ENCASHMENT: `${API_BASE_URL}/encashment`,
  ENCASHMENT_BY_ID: (id: string) => `${API_BASE_URL}/encashment/${id}`,
  ENCASHMENT_BY_POINT_DATE: (pointId: string, date: string) => 
    `${API_BASE_URL}/encashment/query?pointId=${pointId}&date=${date}`,

  // Timesheet
  TIMESHEET: `${API_BASE_URL}/timesheet`,
  TIMESHEET_BY_ID: (id: string) => `${API_BASE_URL}/timesheet/${id}`,
  TIMESHEET_BY_POINT_DATE: (pointId: string, date: string) => 
    `${API_BASE_URL}/timesheet/query?pointId=${pointId}&date=${date}`,

  // Reports
  MORNING_REPORTS: `${API_BASE_URL}/reports/morning`,
  MORNING_REPORT_BY_ID: (id: string) => `${API_BASE_URL}/reports/morning/${id}`,
  MORNING_REPORT_BY_POINT_DATE: (pointId: string, date: string) => 
    `${API_BASE_URL}/reports/morning/query?pointId=${pointId}&date=${date}`,

  EVENING_REPORTS: `${API_BASE_URL}/reports/evening`,
  EVENING_REPORT_BY_ID: (id: string) => `${API_BASE_URL}/reports/evening/${id}`,
  EVENING_REPORT_BY_POINT_DATE: (pointId: string, date: string) => 
    `${API_BASE_URL}/reports/evening/query?pointId=${pointId}&date=${date}`,

  // Audit
  AUDIT_QUESTIONS: `${API_BASE_URL}/audit/questions`,
  AUDIT_QUESTION_BY_ID: (id: string) => `${API_BASE_URL}/audit/questions/${id}`,
  AUDIT_REPORTS: `${API_BASE_URL}/audit/reports`,
  AUDIT_REPORT_BY_ID: (id: string) => `${API_BASE_URL}/audit/reports/${id}`,
};

export default API_BASE_URL;
