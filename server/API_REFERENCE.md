# API Reference - RentControl Pro

Полная документация всех API endpoints.

## Базовый URL

```
http://localhost:3001/api
```

Все запросы (кроме `/auth/login`) требуют JWT токен в заголовке:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication

### POST /api/auth/login
Вход в систему и получение JWT токена.

**Body:**
```json
{
  "login": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "login": "admin",
    "name": "Администратор",
    "role": "ADMIN",
    "assignedPointIds": []
  }
}
```

### GET /api/auth/me
Получить информацию о текущем пользователе.

**Response:**
```json
{
  "id": "uuid",
  "login": "admin",
  "name": "Администратор",
  "role": "ADMIN",
  "assignedPointIds": []
}
```

### POST /api/auth/logout
Выход из системы (на клиенте - удаление токена).

---

## 🏢 Rental Points

### GET /api/points
Получить все точки проката (с учетом RBAC).

**Query params:**
- Нет

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Точка Центр",
    "salaryPercent": 10,
    "cashRegisters": [...],
    "employees": [...]
  }
]
```

### GET /api/points/:id
Получить точку по ID.

### POST /api/points (ADMIN only)
Создать новую точку.

**Body:**
```json
{
  "name": "Новая точка",
  "salaryPercent": 10
}
```

### PUT /api/points/:id (ADMIN only)
Обновить точку.

### DELETE /api/points/:id (ADMIN only)
Удалить точку.

---

## 👥 Users

### GET /api/users (ADMIN only)
Получить всех пользователей.

### POST /api/users (ADMIN only)
Создать пользователя.

**Body:**
```json
{
  "login": "newuser",
  "password": "password123",
  "name": "Новый пользователь",
  "role": "SUPERVISOR",
  "assignedPointIds": ["point-id"]
}
```

**Roles:** `ADMIN`, `MANAGER`, `SUPERVISOR`

### PUT /api/users/:id (ADMIN only)
Обновить пользователя.

### DELETE /api/users/:id (ADMIN only)
Удалить пользователя.

---

## 👨‍💼 Employees

### GET /api/employees
Получить всех сотрудников.

**Query params:**
- `pointId` - фильтр по точке

### GET /api/employees/:id
Получить сотрудника по ID.

### POST /api/employees (ADMIN only)
Создать сотрудника.

**Body:**
```json
{
  "name": "Иванов Иван",
  "position": "Оператор",
  "pointId": "uuid",
  "hourlyRate": 300
}
```

### PUT /api/employees/:id (ADMIN only)
Обновить сотрудника.

### DELETE /api/employees/:id (ADMIN only)
Удалить сотрудника.

---

## 💳 Cash Registers

### GET /api/registers
Получить все кассы.

**Query params:**
- `pointId` - фильтр по точке

### GET /api/registers/:id
Получить кассу по ID.

### POST /api/registers (ADMIN only)
Создать кассу.

**Body:**
```json
{
  "pointId": "uuid",
  "name": "Касса 1"
}
```

### PUT /api/registers/:id (ADMIN only)
Обновить кассу.

### DELETE /api/registers/:id (ADMIN only)
Удалить кассу.

---

## 📅 Schedules

### Point Schedules

#### GET /api/schedules/points
Получить графики работы точек.

**Query params:**
- `pointId` - фильтр по точке
- `startDate` - начальная дата (YYYY-MM-DD)
- `endDate` - конечная дата (YYYY-MM-DD)

#### POST /api/schedules/points (ADMIN, SUPERVISOR)
Создать/обновить график работы точки.

**Body:**
```json
{
  "pointId": "uuid",
  "date": "2026-01-15",
  "openTime": "09:00",
  "closeTime": "21:00"
}
```

#### PUT /api/schedules/points/:id (ADMIN only)
Обновить график.

#### DELETE /api/schedules/points/:id (ADMIN only)
Удалить график.

### Employee Schedules

#### GET /api/schedules/employees
Получить графики работы сотрудников.

**Query params:**
- `employeeId` - фильтр по сотруднику
- `pointId` - фильтр по точке
- `startDate` - начальная дата
- `endDate` - конечная дата

#### POST /api/schedules/employees (ADMIN, SUPERVISOR)
Создать/обновить график сотрудника.

**Body:**
```json
{
  "employeeId": "uuid",
  "pointId": "uuid",
  "date": "2026-01-15",
  "startTime": "09:00",
  "endTime": "18:00"
}
```

#### PUT /api/schedules/employees/:id (ADMIN only)
Обновить график.

#### DELETE /api/schedules/employees/:id (ADMIN only)
Удалить график.

---

## 💰 Revenue

### GET /api/revenue
Получить записи о выручке.

**Query params:**
- `pointId` - фильтр по точке
- `registerId` - фильтр по кассе
- `startDate` - начальная дата
- `endDate` - конечная дата

### GET /api/revenue/stats
Получить статистику по выручке.

**Query params (required):**
- `startDate` - начальная дата
- `endDate` - конечная дата
- `pointId` (optional) - фильтр по точке

**Response:**
```json
{
  "stats": {
    "totalCash": 15000,
    "totalCard": 25000,
    "totalRefundCash": 500,
    "totalRefundCard": 300,
    "netRevenue": 39200
  },
  "entries": [...],
  "period": {
    "startDate": "2026-01-01",
    "endDate": "2026-01-31"
  }
}
```

### GET /api/revenue/:id
Получить запись о выручке по ID.

### POST /api/revenue (ADMIN, SUPERVISOR)
Создать запись о выручке.

**Body:**
```json
{
  "pointId": "uuid",
  "registerId": "uuid",
  "date": "2026-01-15",
  "cash": 5000,
  "card": 8000,
  "refundCash": 100,
  "refundCard": 50
}
```

### PUT /api/revenue/:id (ADMIN only)
Обновить запись.

### DELETE /api/revenue/:id (ADMIN only)
Удалить запись.

---

## 💵 Encashment

### GET /api/encashment
Получить записи об инкассации.

**Query params:**
- `pointId` - фильтр по точке
- `registerId` - фильтр по кассе
- `startDate` - начальная дата
- `endDate` - конечная дата

### GET /api/encashment/stats
Получить статистику по инкассации.

**Query params (required):**
- `startDate` - начальная дата
- `endDate` - конечная дата
- `pointId` (optional) - фильтр по точке

**Response:**
```json
{
  "stats": {
    "totalAmount": 50000,
    "totalCount": 15,
    "byPoint": {
      "point-id-1": {
        "pointName": "Точка Центр",
        "total": 30000,
        "count": 10
      }
    }
  },
  "entries": [...],
  "period": {...}
}
```

### GET /api/encashment/:id
Получить запись об инкассации по ID.

### POST /api/encashment (ADMIN, SUPERVISOR)
Создать запись об инкассации.

**Body:**
```json
{
  "pointId": "uuid",
  "registerId": "uuid",
  "date": "2026-01-15",
  "amount": 10000
}
```

### PUT /api/encashment/:id (ADMIN only)
Обновить запись.

### DELETE /api/encashment/:id (ADMIN only)
Удалить запись.

---

## ⏰ Timesheet

### GET /api/timesheet
Получить табели рабочего времени.

**Query params:**
- `pointId` - фильтр по точке
- `employeeId` - фильтр по сотруднику
- `startDate` - начальная дата
- `endDate` - конечная дата

### GET /api/timesheet/salary/calculate
Рассчитать зарплату на основе табелей.

**Query params (required):**
- `startDate` - начальная дата
- `endDate` - конечная дата
- `pointId` (optional) - фильтр по точке

**Response:**
```json
{
  "salaries": [
    {
      "employeeId": "uuid",
      "employeeName": "Иванов Иван",
      "position": "Оператор",
      "hourlyRate": 300,
      "pointName": "Точка Центр",
      "salaryPercent": 10,
      "totalHours": 160,
      "baseSalary": 48000,
      "pointPercentBonus": 4800,
      "total": 52800
    }
  ],
  "summary": {
    "totalEmployees": 5,
    "totalHours": 800,
    "totalSalary": 240000
  },
  "period": {...}
}
```

### GET /api/timesheet/:id
Получить запись табеля по ID.

### POST /api/timesheet (ADMIN, SUPERVISOR)
Создать запись табеля.

**Body:**
```json
{
  "pointId": "uuid",
  "employeeId": "uuid",
  "date": "2026-01-15",
  "hours": 8,
  "startTime": "09:00",
  "endTime": "18:00"
}
```

### PUT /api/timesheet/:id (ADMIN only)
Обновить запись.

### DELETE /api/timesheet/:id (ADMIN only)
Удалить запись.

---

## 📝 Reports

### Morning Reports

#### GET /api/reports/morning
Получить утренние отчеты.

**Query params:**
- `pointId` - фильтр по точке
- `startDate` - начальная дата
- `endDate` - конечная дата

#### GET /api/reports/morning/:id
Получить утренний отчет по ID.

#### POST /api/reports/morning (ADMIN, SUPERVISOR)
Создать/обновить утренний отчет.

**Body:**
```json
{
  "pointId": "uuid",
  "date": "2026-01-15",
  "openTime": "09:00",
  "employeeIds": ["emp-id-1", "emp-id-2"],
  "media": ["base64-image-1", "base64-image-2"],
  "cashVerified": true
}
```

#### PUT /api/reports/morning/:id (ADMIN, SUPERVISOR)
Обновить отчет.

#### DELETE /api/reports/morning/:id (ADMIN only)
Удалить отчет.

### Evening Reports

#### GET /api/reports/evening
Получить вечерние отчеты.

#### GET /api/reports/evening/:id
Получить вечерний отчет по ID.

#### POST /api/reports/evening (ADMIN, SUPERVISOR)
Создать/обновить вечерний отчет.

**Body:**
```json
{
  "pointId": "uuid",
  "date": "2026-01-15",
  "closeTime": "21:00",
  "cashVerified": true
}
```

#### PUT /api/reports/evening/:id (ADMIN, SUPERVISOR)
Обновить отчет.

#### DELETE /api/reports/evening/:id (ADMIN only)
Удалить отчет.

---

## ✅ Audit

### Audit Questions

#### GET /api/audit/questions
Получить вопросы аудита.

**Query params:**
- `type` - тип аудита (`MORNING` или `EVENING`)

#### GET /api/audit/questions/:id
Получить вопрос по ID.

#### POST /api/audit/questions (ADMIN only)
Создать вопрос аудита.

**Body:**
```json
{
  "text": "Полы чистые?",
  "type": "MORNING",
  "requireOnAnswer": "no",
  "requirementType": ["photo"]
}
```

**requireOnAnswer:** `"yes"`, `"no"`, `"always"`, или `null`
**requirementType:** массив из `"photo"` и/или `"comment"`

#### PUT /api/audit/questions/:id (ADMIN only)
Обновить вопрос.

#### DELETE /api/audit/questions/:id (ADMIN only)
Удалить вопрос.

### Audit Reports

#### GET /api/audit/reports
Получить отчеты аудита.

**Query params:**
- `pointId` - фильтр по точке
- `type` - тип аудита (`MORNING` или `EVENING`)
- `startDate` - начальная дата
- `endDate` - конечная дата

#### GET /api/audit/reports/:id
Получить отчет аудита по ID.

#### POST /api/audit/reports (ADMIN, SUPERVISOR)
Создать/обновить отчет аудита.

**Body:**
```json
{
  "pointId": "uuid",
  "date": "2026-01-15",
  "type": "MORNING",
  "answers": [
    {
      "questionId": "q-id-1",
      "value": true,
      "comment": "Все в порядке",
      "photo": "base64-image"
    }
  ]
}
```

#### PUT /api/audit/reports/:id (ADMIN, SUPERVISOR)
Обновить отчет.

#### DELETE /api/audit/reports/:id (ADMIN only)
Удалить отчет.

---

## 🏥 Health Check

### GET /api/health
Проверка работоспособности API.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-15T10:00:00.000Z"
}
```

---

## 🔒 Authorization Matrix

| Endpoint | ADMIN | MANAGER | SUPERVISOR |
|----------|-------|---------|------------|
| Auth | ✅ | ✅ | ✅ |
| GET Points | ✅ (all) | ✅ (all) | ✅ (assigned) |
| POST/PUT/DELETE Points | ✅ | ❌ | ❌ |
| GET Users | ✅ | ❌ | ❌ |
| POST/PUT/DELETE Users | ✅ | ❌ | ❌ |
| GET Employees | ✅ | ✅ | ✅ |
| POST/PUT/DELETE Employees | ✅ | ❌ | ❌ |
| GET Registers | ✅ | ✅ | ✅ |
| POST/PUT/DELETE Registers | ✅ | ❌ | ❌ |
| GET Schedules | ✅ | ✅ | ✅ |
| POST Schedules | ✅ | ❌ | ✅ (assigned) |
| PUT/DELETE Schedules | ✅ | ❌ | ❌ |
| GET Revenue | ✅ | ✅ | ✅ |
| POST Revenue | ✅ | ❌ | ✅ (assigned) |
| PUT/DELETE Revenue | ✅ | ❌ | ❌ |
| GET/POST Encashment | ✅ | ✅ | ✅ (assigned) |
| PUT/DELETE Encashment | ✅ | ❌ | ❌ |
| GET Timesheet | ✅ | ✅ | ✅ |
| POST Timesheet | ✅ | ❌ | ✅ (assigned) |
| PUT/DELETE Timesheet | ✅ | ❌ | ❌ |
| GET Reports | ✅ | ✅ | ✅ |
| POST/PUT Reports | ✅ | ❌ | ✅ (assigned) |
| DELETE Reports | ✅ | ❌ | ❌ |
| GET Audit | ✅ | ✅ | ✅ |
| POST/PUT Audit Reports | ✅ | ❌ | ✅ (assigned) |
| POST/PUT/DELETE Audit Questions | ✅ | ❌ | ❌ |

---

## 📊 Error Responses

Все ошибки возвращаются в формате:

```json
{
  "error": "Error message"
}
```

**HTTP коды:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 💡 Примеры использования

### Curl
```bash
# Login
TOKEN=$(curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","password":"admin123"}' \
  | jq -r '.token')

# Get points
curl http://localhost:3001/api/points \
  -H "Authorization: Bearer $TOKEN"

# Create revenue entry
curl -X POST http://localhost:3001/api/revenue \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pointId": "uuid",
    "registerId": "uuid",
    "date": "2026-01-15",
    "cash": 5000,
    "card": 8000,
    "refundCash": 100,
    "refundCard": 50
  }'
```

### JavaScript (fetch)
```javascript
// Login
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ login: 'admin', password: 'admin123' })
});
const { token } = await response.json();

// Get points
const pointsResponse = await fetch('http://localhost:3001/api/points', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const points = await pointsResponse.json();
```
