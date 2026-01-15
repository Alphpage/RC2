# ⚙️ Автоматическое определение Backend URL

## 📝 Как это работает:

Frontend теперь автоматически определяет URL backend в следующем порядке:

### 1. Environment Variable (приоритет)
Если установлена `VITE_API_URL` в Render Environment:
```
VITE_API_URL=https://your-backend.onrender.com/api
```

### 2. Auto-detection на Render
Если frontend запущен на `*.onrender.com`, использует:
```
https://rentcontrol-backend.onrender.com/api
```

### 3. Localhost для разработки
Если запущен локально, использует:
```
http://localhost:3001/api
```

---

## 🔧 Настройка вашего Backend URL:

### Вариант 1: Через Environment Variable (рекомендуется)

**Render Dashboard** → **Static Site (Frontend)** → **Environment**:

```
VITE_API_URL=https://YOUR-REAL-BACKEND-URL.onrender.com/api
```

Замените `YOUR-REAL-BACKEND-URL` на ваш реальный backend URL из Render.

### Вариант 2: Изменить fallback в коде

**Файл:** `config/api.ts`

Найдите строку:
```typescript
return 'https://rentcontrol-backend.onrender.com/api';
```

Замените на ваш реальный URL:
```typescript
return 'https://YOUR-ACTUAL-BACKEND-URL.onrender.com/api';
```

---

## 🔍 Проверка текущего URL:

Откройте консоль браузера (F12) и посмотрите:
```
🔌 API Base URL: https://...
```

Это сообщение показывает, какой URL используется.

---

## 🧪 Тестирование:

### В консоли браузера (F12):
```javascript
// Проверьте подключение к backend
fetch('https://your-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(d => console.log('Backend status:', d));
```

Должно вернуть:
```json
{"status":"ok","timestamp":"2026-01-15T..."}
```

---

## 📊 Ваши URL:

**Найдите ваши URL в Render Dashboard:**

### Backend URL:
1. Render Dashboard → Web Services → `rentcontrol-backend`
2. Скопируйте URL (например: `https://rentcontrol-backend-xyz.onrender.com`)

### Frontend URL:
1. Render Dashboard → Static Sites → `rentcontrol-frontend`
2. Скопируйте URL (например: `https://rentcontrol-frontend.onrender.com`)

### Полный Backend API URL:
```
https://YOUR-BACKEND-URL.onrender.com/api
```

---

## ✅ После настройки:

1. **Redeploy Frontend** (если изменили Environment Variable)
2. **Обновите `CORS_ORIGIN` на Backend:**
   ```
   CORS_ORIGIN=https://your-frontend.onrender.com
   ```
3. **Проверьте в браузере:**
   - Откройте Frontend
   - Откройте консоль (F12)
   - Увидите: `🔌 API Base URL: https://...`
   - Попробуйте войти

---

**Сообщите ваш Backend URL - я обновлю код с правильным fallback! 🚀**
