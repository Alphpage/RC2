import { API_ENDPOINTS } from '../config/api';

// Token management
const TOKEN_KEY = 'auth_token';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// API Error class
export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Base fetch wrapper with auth
async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ApiError(response.status, errorData.error || response.statusText);
    }

    return response.json();
  } catch (error: any) {
    // Улучшенная обработка ошибок
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network errors
    if (error.message === 'Failed to fetch') {
      throw new ApiError(0, 'Не удалось подключиться к серверу. Проверьте интернет-соединение.');
    }
    
    throw new ApiError(0, error.message || 'Неизвестная ошибка');
  }
}

// Auth API
export const authApi = {
  login: async (login: string, password: string) => {
    const response = await apiFetch<{ token: string; user: any }>(
      API_ENDPOINTS.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify({ login, password }),
      }
    );
    setToken(response.token);
    return response;
  },

  logout: () => {
    removeToken();
  },

  me: () => apiFetch<{ user: any }>(API_ENDPOINTS.ME),
};

// Points API
export const pointsApi = {
  getAll: () => apiFetch<any[]>(API_ENDPOINTS.POINTS),
  getById: (id: string) => apiFetch<any>(API_ENDPOINTS.POINT_BY_ID(id)),
  create: (data: any) => apiFetch<any>(API_ENDPOINTS.POINTS, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiFetch<any>(API_ENDPOINTS.POINT_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiFetch<void>(API_ENDPOINTS.POINT_BY_ID(id), {
    method: 'DELETE',
  }),
};

// Users API
export const usersApi = {
  getAll: () => apiFetch<any[]>(API_ENDPOINTS.USERS),
  getById: (id: string) => apiFetch<any>(API_ENDPOINTS.USER_BY_ID(id)),
  create: (data: any) => apiFetch<any>(API_ENDPOINTS.USERS, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiFetch<any>(API_ENDPOINTS.USER_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiFetch<void>(API_ENDPOINTS.USER_BY_ID(id), {
    method: 'DELETE',
  }),
};

// Employees API
export const employeesApi = {
  getAll: () => apiFetch<any[]>(API_ENDPOINTS.EMPLOYEES),
  getById: (id: string) => apiFetch<any>(API_ENDPOINTS.EMPLOYEE_BY_ID(id)),
  getByPoint: (pointId: string) => apiFetch<any[]>(API_ENDPOINTS.EMPLOYEES_BY_POINT(pointId)),
  create: (data: any) => apiFetch<any>(API_ENDPOINTS.EMPLOYEES, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiFetch<any>(API_ENDPOINTS.EMPLOYEE_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiFetch<void>(API_ENDPOINTS.EMPLOYEE_BY_ID(id), {
    method: 'DELETE',
  }),
};

// Registers API
export const registersApi = {
  getAll: () => apiFetch<any[]>(API_ENDPOINTS.REGISTERS),
  getById: (id: string) => apiFetch<any>(API_ENDPOINTS.REGISTER_BY_ID(id)),
  getByPoint: (pointId: string) => apiFetch<any[]>(API_ENDPOINTS.REGISTERS_BY_POINT(pointId)),
  create: (data: any) => apiFetch<any>(API_ENDPOINTS.REGISTERS, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiFetch<any>(API_ENDPOINTS.REGISTER_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiFetch<void>(API_ENDPOINTS.REGISTER_BY_ID(id), {
    method: 'DELETE',
  }),
};

// Point Schedules API
export const pointSchedulesApi = {
  getAll: () => apiFetch<any[]>(API_ENDPOINTS.POINT_SCHEDULES),
  getById: (id: string) => apiFetch<any>(API_ENDPOINTS.POINT_SCHEDULE_BY_ID(id)),
  getByPointAndDate: (pointId: string, date: string) => 
    apiFetch<any[]>(API_ENDPOINTS.POINT_SCHEDULES_BY_DATE(pointId, date)),
  create: (data: any) => apiFetch<any>(API_ENDPOINTS.POINT_SCHEDULES, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiFetch<any>(API_ENDPOINTS.POINT_SCHEDULE_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiFetch<void>(API_ENDPOINTS.POINT_SCHEDULE_BY_ID(id), {
    method: 'DELETE',
  }),
};

// Employee Schedules API
export const employeeSchedulesApi = {
  getAll: () => apiFetch<any[]>(API_ENDPOINTS.EMPLOYEE_SCHEDULES),
  getById: (id: string) => apiFetch<any>(API_ENDPOINTS.EMPLOYEE_SCHEDULE_BY_ID(id)),
  getByEmployeeAndDate: (employeeId: string, date: string) => 
    apiFetch<any[]>(API_ENDPOINTS.EMPLOYEE_SCHEDULES_BY_DATE(employeeId, date)),
  create: (data: any) => apiFetch<any>(API_ENDPOINTS.EMPLOYEE_SCHEDULES, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiFetch<any>(API_ENDPOINTS.EMPLOYEE_SCHEDULE_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiFetch<void>(API_ENDPOINTS.EMPLOYEE_SCHEDULE_BY_ID(id), {
    method: 'DELETE',
  }),
};

// Revenue API
export const revenueApi = {
  getAll: () => apiFetch<any[]>(API_ENDPOINTS.REVENUE),
  getById: (id: string) => apiFetch<any>(API_ENDPOINTS.REVENUE_BY_ID(id)),
  getByPointAndDate: (pointId: string, date: string) => 
    apiFetch<any[]>(API_ENDPOINTS.REVENUE_BY_POINT_DATE(pointId, date)),
  create: (data: any) => apiFetch<any>(API_ENDPOINTS.REVENUE, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiFetch<any>(API_ENDPOINTS.REVENUE_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiFetch<void>(API_ENDPOINTS.REVENUE_BY_ID(id), {
    method: 'DELETE',
  }),
};

// Encashment API
export const encashmentApi = {
  getAll: () => apiFetch<any[]>(API_ENDPOINTS.ENCASHMENT),
  getById: (id: string) => apiFetch<any>(API_ENDPOINTS.ENCASHMENT_BY_ID(id)),
  getByPointAndDate: (pointId: string, date: string) => 
    apiFetch<any[]>(API_ENDPOINTS.ENCASHMENT_BY_POINT_DATE(pointId, date)),
  create: (data: any) => apiFetch<any>(API_ENDPOINTS.ENCASHMENT, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiFetch<any>(API_ENDPOINTS.ENCASHMENT_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiFetch<void>(API_ENDPOINTS.ENCASHMENT_BY_ID(id), {
    method: 'DELETE',
  }),
};

// Timesheet API
export const timesheetApi = {
  getAll: () => apiFetch<any[]>(API_ENDPOINTS.TIMESHEET),
  getById: (id: string) => apiFetch<any>(API_ENDPOINTS.TIMESHEET_BY_ID(id)),
  getByPointAndDate: (pointId: string, date: string) => 
    apiFetch<any[]>(API_ENDPOINTS.TIMESHEET_BY_POINT_DATE(pointId, date)),
  create: (data: any) => apiFetch<any>(API_ENDPOINTS.TIMESHEET, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiFetch<any>(API_ENDPOINTS.TIMESHEET_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiFetch<void>(API_ENDPOINTS.TIMESHEET_BY_ID(id), {
    method: 'DELETE',
  }),
};

// Morning Reports API
export const morningReportsApi = {
  getAll: () => apiFetch<any[]>(API_ENDPOINTS.MORNING_REPORTS),
  getById: (id: string) => apiFetch<any>(API_ENDPOINTS.MORNING_REPORT_BY_ID(id)),
  getByPointAndDate: (pointId: string, date: string) => 
    apiFetch<any[]>(API_ENDPOINTS.MORNING_REPORT_BY_POINT_DATE(pointId, date)),
  create: (data: any) => apiFetch<any>(API_ENDPOINTS.MORNING_REPORTS, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiFetch<any>(API_ENDPOINTS.MORNING_REPORT_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiFetch<void>(API_ENDPOINTS.MORNING_REPORT_BY_ID(id), {
    method: 'DELETE',
  }),
};

// Evening Reports API
export const eveningReportsApi = {
  getAll: () => apiFetch<any[]>(API_ENDPOINTS.EVENING_REPORTS),
  getById: (id: string) => apiFetch<any>(API_ENDPOINTS.EVENING_REPORT_BY_ID(id)),
  getByPointAndDate: (pointId: string, date: string) => 
    apiFetch<any[]>(API_ENDPOINTS.EVENING_REPORT_BY_POINT_DATE(pointId, date)),
  create: (data: any) => apiFetch<any>(API_ENDPOINTS.EVENING_REPORTS, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiFetch<any>(API_ENDPOINTS.EVENING_REPORT_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiFetch<void>(API_ENDPOINTS.EVENING_REPORT_BY_ID(id), {
    method: 'DELETE',
  }),
};

// Audit API
export const auditApi = {
  getQuestions: (type?: 'MORNING' | 'EVENING') => {
    const url = type 
      ? `${API_ENDPOINTS.AUDIT_QUESTIONS}?type=${type}`
      : API_ENDPOINTS.AUDIT_QUESTIONS;
    return apiFetch<any[]>(url);
  },
  createQuestion: (data: any) => apiFetch<any>(API_ENDPOINTS.AUDIT_QUESTIONS, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateQuestion: (id: string, data: any) => apiFetch<any>(API_ENDPOINTS.AUDIT_QUESTION_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteQuestion: (id: string) => apiFetch<void>(API_ENDPOINTS.AUDIT_QUESTION_BY_ID(id), {
    method: 'DELETE',
  }),

  getReports: () => apiFetch<any[]>(API_ENDPOINTS.AUDIT_REPORTS),
  getReportById: (id: string) => apiFetch<any>(API_ENDPOINTS.AUDIT_REPORT_BY_ID(id)),
  createReport: (data: any) => apiFetch<any>(API_ENDPOINTS.AUDIT_REPORTS, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateReport: (id: string, data: any) => apiFetch<any>(API_ENDPOINTS.AUDIT_REPORT_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

export default {
  auth: authApi,
  points: pointsApi,
  users: usersApi,
  employees: employeesApi,
  registers: registersApi,
  pointSchedules: pointSchedulesApi,
  employeeSchedules: employeeSchedulesApi,
  revenue: revenueApi,
  encashment: encashmentApi,
  timesheet: timesheetApi,
  morningReports: morningReportsApi,
  eveningReports: eveningReportsApi,
  audit: auditApi,
};
