# 🔌 Frontend-Backend Integration Guide

## Проблема: Данные не сохраняются после перезагрузки

**Причина:** Frontend использует локальное состояние (mock-данные) вместо API calls к backend.

**Решение:** Подключить frontend к backend API.

---

## ✅ Что уже сделано:

1. **Создан API клиент:** `services/apiClient.ts`
   - Методы для всех сущностей (auth, points, users, employees, и т.д.)
   - Автоматическая обработка JWT токенов
   - Error handling

2. **Создана конфигурация API:** `config/api.ts`
   - Все endpoints
   - Настраиваемый базовый URL

3. **Создан `.env.example`** для настройки URL backend

---

## 🚀 Шаги интеграции:

### Шаг 1: Настройте Backend URL

1. **Создайте файл `.env.local`** в корне проекта:
   ```bash
   cd /home/user/webapp
   cp .env.example .env.local
   ```

2. **Отредактируйте `.env.local`:**
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
   
   Замените `your-backend-url` на реальный URL вашего backend.

3. **Для локальной разработки** (если backend на localhost):
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

---

### Шаг 2: Обновите CORS на Backend

Добавьте Frontend URL в CORS настройки backend:

**Render Dashboard** → **Backend Service** → **Environment**:
```
CORS_ORIGIN=https://rentcontrol-frontend.onrender.com
```

---

### Шаг 3: Обновите компонент LoginView

Замените mock-аутентификацию на API call:

**Файл:** `components/LoginView.tsx`

```tsx
import api from '../services/apiClient';

// В функции handleSubmit:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const response = await api.auth.login(login, password);
    onLogin(response.user); // Передаем пользователя из API
  } catch (err: any) {
    setError(err.message || 'Ошибка входа');
  } finally {
    setIsLoading(false);
  }
};
```

---

### Шаг 4: Обновите App.tsx для загрузки данных

Замените mock-данные на API calls:

**Файл:** `App.tsx`

```tsx
import { useEffect } from 'react';
import api from './services/apiClient';

// Внутри App компонента:
useEffect(() => {
  if (currentUser) {
    loadData();
  }
}, [currentUser]);

const loadData = async () => {
  try {
    // Загружаем все данные
    const [
      pointsData,
      registersData,
      employeesData,
      usersData,
      // ... остальные данные
    ] = await Promise.all([
      api.points.getAll(),
      api.registers.getAll(),
      api.employees.getAll(),
      api.users.getAll(),
      // ... остальные API calls
    ]);

    setPoints(pointsData);
    setRegisters(registersData);
    setEmployees(employeesData);
    setUsers(usersData);
    // ... установка остальных данных
  } catch (error) {
    console.error('Error loading data:', error);
  }
};
```

---

### Шаг 5: Обновите handlers для сохранения данных

Замените локальные обновления состояния на API calls:

```tsx
const handleSaveMorningReport = async (report: MorningReport) => {
  try {
    if (report.id) {
      // Update existing
      await api.morningReports.update(report.id, report);
    } else {
      // Create new
      await api.morningReports.create(report);
    }
    
    // Reload data after save
    await loadData();
  } catch (error) {
    console.error('Error saving morning report:', error);
    alert('Ошибка сохранения отчета');
  }
};

// Аналогично для всех других handlers:
// - handleSaveEveningReport
// - handleSavePoint
// - handleSaveEmployee
// - и т.д.
```

---

## 📝 Полный пример интеграции

### Пример: Интеграция PointsView

**Было (mock):**
```tsx
const handleAddPoint = (point: RentalPoint) => {
  setPoints([...points, point]);
};
```

**Стало (API):**
```tsx
const handleAddPoint = async (point: RentalPoint) => {
  try {
    const newPoint = await api.points.create(point);
    setPoints([...points, newPoint]);
  } catch (error) {
    console.error('Error adding point:', error);
    alert('Ошибка добавления точки');
  }
};
```

---

## 🧪 Тестирование интеграции

### 1. Проверьте подключение к API:

Откройте консоль браузера (F12) и выполните:

```javascript
fetch('https://your-backend-url.onrender.com/api/health')
  .then(r => r.json())
  .then(data => console.log('Backend:', data));
```

Должно вернуть: `{status: "ok", timestamp: "..."}`

### 2. Проверьте авторизацию:

После входа проверьте наличие токена:
```javascript
localStorage.getItem('auth_token')
```

### 3. Проверьте CORS:

Если видите ошибку CORS в консоли:
```
Access to fetch ... has been blocked by CORS policy
```

**Решение:**
- Обновите `CORS_ORIGIN` на backend
- Перезапустите backend service

---

## 🔄 Автоматическая синхронизация (опционально)

Для real-time обновлений можно добавить polling:

```tsx
useEffect(() => {
  if (!currentUser) return;

  // Загружаем данные каждые 30 секунд
  const interval = setInterval(() => {
    loadData();
  }, 30000);

  return () => clearInterval(interval);
}, [currentUser]);
```

---

## ⚠️ Важные моменты:

### 1. Обработка ошибок сети

```tsx
const handleApiError = (error: any) => {
  if (error.statusCode === 401) {
    // Unauthorized - logout
    api.auth.logout();
    setCurrentUser(null);
    alert('Сессия истекла, войдите снова');
  } else if (error.statusCode === 403) {
    alert('Нет прав доступа');
  } else {
    alert('Ошибка: ' + error.message);
  }
};
```

### 2. Loading состояния

Добавьте индикаторы загрузки:
```tsx
const [isLoading, setIsLoading] = useState(false);

const loadData = async () => {
  setIsLoading(true);
  try {
    // ... API calls
  } finally {
    setIsLoading(false);
  }
};
```

### 3. Offline режим

Backend на Render Free tier засыпает после 15 минут:
- Первый запрос после сна: 30-60 секунд
- Добавьте retry логику или loading state

---

## 📊 Миграция по этапам:

### Этап 1: Авторизация (приоритет HIGH)
- ✅ Создан API клиент
- ⏳ Обновить LoginView
- ⏳ Обновить App.tsx handleLogin

### Этап 2: Чтение данных (приоритет HIGH)
- ⏳ Загрузка points при входе
- ⏳ Загрузка employees при входе
- ⏳ Загрузка registers при входе
- ⏳ Загрузка users при входе

### Этап 3: Запись данных (приоритет MEDIUM)
- ⏳ Сохранение morning reports
- ⏳ Сохранение evening reports
- ⏳ Сохранение revenue entries
- ⏳ Сохранение timesheet entries

### Этап 4: CRUD операции (приоритет LOW)
- ⏳ Создание/редактирование точек
- ⏳ Создание/редактирование сотрудников
- ⏳ Создание/редактирование пользователей

---

## 🚀 Быстрая интеграция (за 10 минут):

Я могу автоматически обновить все компоненты для работы с API.

**Хотите, чтобы я:**
1. Обновил `LoginView.tsx` для API авторизации?
2. Обновил `App.tsx` для загрузки данных из API?
3. Обновил все handlers для сохранения в API?

**Ответьте:** "Да, интегрируй с API" и я сделаю все автоматически.

---

## 📚 Дополнительная информация:

- **API Documentation:** `server/API_REFERENCE.md`
- **Backend URL:** Render Dashboard → Backend Service → URL
- **Testing API:** Используйте Postman или curl для тестирования endpoints

---

## ✅ Результат после интеграции:

- ✅ Данные сохраняются в PostgreSQL
- ✅ Данные доступны после перезагрузки страницы
- ✅ Данные синхронизируются между пользователями
- ✅ JWT авторизация работает
- ✅ RBAC (права доступа) применяются на backend

**Готов начать интеграцию? 🚀**
