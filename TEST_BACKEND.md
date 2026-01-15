# 🔍 Ручная проверка Backend API

## Backend URL: https://rentcontrol-backend.onrender.com

---

## ✅ Тест 1: Health Check (самый простой)

### Через браузер:
Откройте в браузере:
```
https://rentcontrol-backend.onrender.com/api/health
```

**Ожидаемый результат:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-15T12:34:56.789Z"
}
```

### Через curl (в терминале):
```bash
curl https://rentcontrol-backend.onrender.com/api/health
```

**✅ Если видите JSON с `"status": "ok"` - backend работает!**

---

## ✅ Тест 2: Login (авторизация)

### Через curl:
```bash
curl -X POST https://rentcontrol-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","password":"admin123"}'
```

**Ожидаемый результат:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-string",
    "login": "admin",
    "name": "Администратор",
    "role": "ADMIN",
    "assignedPointIds": []
  }
}
```

**✅ Если видите `token` и `user` - авторизация работает!**

---

## ✅ Тест 3: Получить список точек (требует авторизации)

### Шаг 1: Получите токен
```bash
# Сохраните токен в переменную
TOKEN=$(curl -s -X POST https://rentcontrol-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","password":"admin123"}' \
  | grep -o '"token":"[^"]*"' \
  | cut -d'"' -f4)

echo "Token: $TOKEN"
```

### Шаг 2: Запросите точки
```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://rentcontrol-backend.onrender.com/api/points
```

**Ожидаемый результат:**
```json
[
  {
    "id": "uuid",
    "name": "Точка Центр",
    "salaryPercent": 10,
    "createdAt": "...",
    "updatedAt": "..."
  },
  {
    "id": "uuid",
    "name": "Парк Победы",
    "salaryPercent": 5,
    "createdAt": "...",
    "updatedAt": "..."
  },
  {
    "id": "uuid",
    "name": "Набережная",
    "salaryPercent": 7,
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

**✅ Если видите массив из 3 точек - данные есть!**

---

## ✅ Тест 4: Получить пользователей

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://rentcontrol-backend.onrender.com/api/users
```

**Ожидаемый результат:**
```json
[
  {
    "id": "uuid",
    "login": "admin",
    "name": "Администратор",
    "role": "ADMIN",
    "assignedPointIds": []
  },
  {
    "id": "uuid",
    "login": "manager",
    "name": "Менеджер",
    "role": "MANAGER",
    "assignedPointIds": []
  },
  {
    "id": "uuid",
    "login": "supervisor",
    "name": "Управляющий",
    "role": "SUPERVISOR",
    "assignedPointIds": ["uuid-of-point"]
  }
]
```

**✅ Если видите 3 пользователей - seed выполнен!**

---

## ✅ Тест 5: Получить сотрудников

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://rentcontrol-backend.onrender.com/api/employees
```

**Ожидаемый результат:**
```json
[
  {
    "id": "uuid",
    "name": "Иванов Иван",
    "position": "Старший оператор",
    "pointId": "uuid",
    "hourlyRate": 300,
    "createdAt": "...",
    "updatedAt": "..."
  },
  // ... еще 3 сотрудника
]
```

**✅ Если видите 4 сотрудников - всё работает!**

---

## 🌐 Через Postman / Insomnia / HTTPie

### 1. Health Check
```
GET https://rentcontrol-backend.onrender.com/api/health
```

### 2. Login
```
POST https://rentcontrol-backend.onrender.com/api/auth/login
Content-Type: application/json

{
  "login": "admin",
  "password": "admin123"
}
```

### 3. Get Points (с токеном)
```
GET https://rentcontrol-backend.onrender.com/api/points
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📊 Проверка через браузер (для быстрых тестов)

### 1. Health Check
Просто откройте:
```
https://rentcontrol-backend.onrender.com/api/health
```

### 2. Все остальные endpoints требуют POST или Authorization
Используйте расширение браузера:
- **Chrome:** [REST Client](https://chrome.google.com/webstore/detail/rest-client)
- **Firefox:** [RESTClient](https://addons.mozilla.org/en-US/firefox/addon/restclient/)

---

## 🐛 Проверка логов Backend

### Render Dashboard:
1. Откройте https://dashboard.render.com
2. Web Services → `rentcontrol-backend`
3. Нажмите **"Logs"**
4. Проверьте последние логи

**Что искать:**
```
✅ Good:
🚀 Server running on port 3001
✔ Generated Prisma Client
Database connected

❌ Bad:
Error: connect ECONNREFUSED
PrismaClientInitializationError
Error: Database connection failed
```

---

## ⚠️ Частые проблемы и их признаки:

### 1. Backend засыпает (Free tier)
**Симптомы:**
- Первый запрос: 30-60 секунд
- Последующие: быстро

**Решение:** Подождите первого запроса

### 2. Database не подключена
**Симптомы:**
```bash
curl https://rentcontrol-backend.onrender.com/api/health
# Timeout или 500 error
```

**Решение:** Проверьте `DATABASE_URL` в Environment Variables

### 3. Seed не выполнен (нет пользователей)
**Симптомы:**
```bash
curl -X POST ... /api/auth/login
# {"error":"Invalid credentials"}
```

**Решение:**
```bash
# Render Shell:
cd server && npx prisma db seed
```

### 4. CORS ошибка (только в браузере)
**Симптомы:** В консоли браузера (F12):
```
Access to fetch ... blocked by CORS policy
```

**Решение:** Backend → Environment → `CORS_ORIGIN=https://your-frontend-url`

---

## 🧪 Полный тестовый скрипт

Сохраните в файл `test-backend.sh`:

```bash
#!/bin/bash

BACKEND_URL="https://rentcontrol-backend.onrender.com"
API_URL="$BACKEND_URL/api"

echo "🔍 Testing Backend: $BACKEND_URL"
echo ""

# Test 1: Health Check
echo "✅ Test 1: Health Check"
curl -s "$API_URL/health" | jq '.'
echo ""

# Test 2: Login
echo "✅ Test 2: Login as admin"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","password":"admin123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" != "null" ]; then
  echo "✅ Login successful! Token: ${TOKEN:0:20}..."
else
  echo "❌ Login failed!"
  echo $LOGIN_RESPONSE | jq '.'
  exit 1
fi
echo ""

# Test 3: Get Points
echo "✅ Test 3: Get Points"
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/points" | jq '.'
echo ""

# Test 4: Get Users
echo "✅ Test 4: Get Users"
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/users" | jq '.'
echo ""

# Test 5: Get Employees
echo "✅ Test 5: Get Employees"
curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/employees" | jq '.'
echo ""

echo "🎉 All tests completed!"
```

Запустите:
```bash
chmod +x test-backend.sh
./test-backend.sh
```

---

## 📋 Быстрый чеклист проверки:

Выполните эти команды по порядку:

```bash
# 1. Health Check
curl https://rentcontrol-backend.onrender.com/api/health

# 2. Login
curl -X POST https://rentcontrol-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","password":"admin123"}'

# 3. Если login вернул токен - сохраните его:
TOKEN="PASTE_YOUR_TOKEN_HERE"

# 4. Get Points
curl -H "Authorization: Bearer $TOKEN" \
  https://rentcontrol-backend.onrender.com/api/points

# 5. Get Employees
curl -H "Authorization: Bearer $TOKEN" \
  https://rentcontrol-backend.onrender.com/api/employees
```

---

## ✅ Результаты проверки:

### Если всё работает:
- ✅ Health check возвращает `{"status":"ok"}`
- ✅ Login возвращает `token` и `user`
- ✅ Points возвращает массив из 3 точек
- ✅ Employees возвращает массив из 4 сотрудников
- ✅ **Backend полностью рабочий!**

### Если что-то не работает:
- ❌ Health check timeout → Backend спит или не запущен
- ❌ Login `Invalid credentials` → Нет пользователей (нужен seed)
- ❌ Points/Employees empty array `[]` → Нет данных (нужен seed)
- ❌ 401 Unauthorized → Неправильный токен или истек

---

## 🎯 Следующий шаг:

После проверки backend, проверьте frontend:
1. Откройте https://rentcontrol-frontend.onrender.com
2. Откройте консоль (F12)
3. Проверьте: `🔌 API Base URL: ...`
4. Войдите: `admin` / `admin123`

**Сообщите результаты проверки! 🚀**
