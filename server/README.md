# RentControl Pro - Backend API

Backend API для системы управления точками проката, построенный на Node.js + Express + TypeScript + Prisma + PostgreSQL.

## 🚀 Функциональность

- ✅ JWT аутентификация
- ✅ RBAC (Role-Based Access Control)
- ✅ RESTful API
- ✅ PostgreSQL через Prisma ORM
- ✅ Логирование с Winston
- ✅ TypeScript для типобезопасности
- ✅ CORS настройка
- ✅ Валидация данных

## 📋 Требования

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm или yarn

## 🛠️ Установка

### 1. Установка зависимостей

```bash
cd server
npm install
```

### 2. Настройка базы данных

Создайте PostgreSQL базу данных:

```sql
CREATE DATABASE rentcontrol_db;
```

### 3. Настройка переменных окружения

Скопируйте `.env.example` в `.env` и настройте переменные:

```bash
cp .env.example .env
```

Отредактируйте `.env`:

```env
NODE_ENV=development
PORT=3001
API_PREFIX=/api

DATABASE_URL="postgresql://username:password@localhost:5432/rentcontrol_db?schema=public"

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

CORS_ORIGIN=http://localhost:5173
```

### 4. Запуск миграций Prisma

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Создание начальных пользователей (опционально)

Создайте seed файл или используйте Prisma Studio для создания пользователей:

```bash
npm run prisma:studio
```

Пример пользователей:
- **Admin**: login: `admin`, password: `admin123`
- **Manager**: login: `manager`, password: `manager123`
- **Supervisor**: login: `supervisor`, password: `supervisor123`

**Важно:** Пароли должны быть захешированы с помощью bcrypt!

## 🏃 Запуск

### Development режим

```bash
npm run dev
```

Сервер запустится на `http://localhost:3001`

### Production сборка

```bash
npm run build
npm start
```

## 📚 API Документация

### Базовый URL

```
http://localhost:3001/api
```

### Аутентификация

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "login": "admin",
  "password": "admin123"
}
```

**Ответ:**
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

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Точки проката (Rental Points)

#### Получить все точки
```http
GET /api/points
Authorization: Bearer <token>
```

#### Получить точку по ID
```http
GET /api/points/:id
Authorization: Bearer <token>
```

#### Создать точку (только ADMIN)
```http
POST /api/points
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Точка Центр",
  "salaryPercent": 10
}
```

#### Обновить точку (только ADMIN)
```http
PUT /api/points/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Новое название",
  "salaryPercent": 15
}
```

#### Удалить точку (только ADMIN)
```http
DELETE /api/points/:id
Authorization: Bearer <token>
```

### Пользователи

#### Получить всех пользователей (только ADMIN)
```http
GET /api/users
Authorization: Bearer <token>
```

#### Создать пользователя (только ADMIN)
```http
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "login": "newuser",
  "password": "password123",
  "name": "Новый пользователь",
  "role": "SUPERVISOR",
  "assignedPointIds": ["point-id-1"]
}
```

#### Обновить пользователя (только ADMIN)
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Обновленное имя",
  "role": "MANAGER"
}
```

#### Удалить пользователя (только ADMIN)
```http
DELETE /api/users/:id
Authorization: Bearer <token>
```

### Сотрудники

#### Получить всех сотрудников
```http
GET /api/employees
GET /api/employees?pointId=<point-id>
Authorization: Bearer <token>
```

#### Получить сотрудника по ID
```http
GET /api/employees/:id
Authorization: Bearer <token>
```

#### Создать сотрудника (только ADMIN)
```http
POST /api/employees
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Иванов Иван",
  "position": "Оператор",
  "pointId": "point-id",
  "hourlyRate": 300
}
```

#### Обновить сотрудника (только ADMIN)
```http
PUT /api/employees/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Иванов Иван Петрович",
  "hourlyRate": 350
}
```

#### Удалить сотрудника (только ADMIN)
```http
DELETE /api/employees/:id
Authorization: Bearer <token>
```

### Health Check

```http
GET /api/health
```

**Ответ:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-15T10:00:00.000Z"
}
```

## 🔐 Роли пользователей

### ADMIN
- Полный доступ ко всем функциям
- Создание/редактирование/удаление всех сущностей
- Управление пользователями
- Просмотр всех точек

### MANAGER
- Только чтение
- Просмотр всех данных
- Без прав редактирования

### SUPERVISOR
- Ввод данных по назначенным точкам
- Просмотр только назначенных точек
- Создание отчетов

## 📁 Структура проекта

```
server/
├── src/
│   ├── config/          # Конфигурация
│   │   ├── database.ts  # Prisma клиент
│   │   └── index.ts     # Общие настройки
│   ├── controllers/     # Контроллеры API
│   │   ├── authController.ts
│   │   ├── pointsController.ts
│   │   ├── usersController.ts
│   │   └── employeesController.ts
│   ├── middleware/      # Middleware
│   │   ├── auth.ts      # JWT аутентификация
│   │   └── errorHandler.ts
│   ├── routes/          # Маршруты API
│   │   ├── authRoutes.ts
│   │   ├── pointsRoutes.ts
│   │   ├── usersRoutes.ts
│   │   ├── employeesRoutes.ts
│   │   └── index.ts
│   ├── utils/           # Утилиты
│   │   └── logger.ts    # Winston логгер
│   └── index.ts         # Главный файл
├── prisma/
│   └── schema.prisma    # Prisma схема БД
├── package.json
├── tsconfig.json
└── .env
```

## 🗃️ База данных

### Основные таблицы

- **users** - Пользователи системы
- **rental_points** - Точки проката
- **cash_registers** - Кассы
- **employees** - Сотрудники
- **point_schedules** - Графики работы точек
- **employee_schedules** - Графики работы сотрудников
- **revenue_entries** - Записи о выручке
- **timesheet_entries** - Табели рабочего времени
- **encashment_entries** - Инкассация
- **morning_reports** - Утренние отчеты
- **evening_reports** - Вечерние отчеты
- **audit_questions** - Вопросы аудита
- **audit_reports** - Отчеты аудита

## 🔧 Prisma команды

```bash
# Генерация Prisma Client
npm run prisma:generate

# Создание миграции
npm run prisma:migrate

# Открыть Prisma Studio
npm run prisma:studio
```

## 📝 TODO

- [ ] Добавить контроллеры для остальных сущностей (registers, schedules, reports, etc.)
- [ ] Реализовать загрузку файлов (фото в отчетах)
- [ ] Добавить валидацию данных с express-validator
- [ ] Swagger/OpenAPI документация
- [ ] Unit тесты
- [ ] Rate limiting
- [ ] Кэширование с Redis

## 🤝 Разработка

Для разработки используется:
- **nodemon** - автоматический перезапуск при изменениях
- **ts-node** - выполнение TypeScript без компиляции
- **Prisma Studio** - GUI для работы с БД

## 📄 Лицензия

ISC
