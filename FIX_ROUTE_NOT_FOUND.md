# 🚨 СРОЧНОЕ РЕШЕНИЕ: Route not found при входе

## Проблема:
При попытке входа появляется ошибка "Route not found".

## Причина:
Frontend пытается подключиться к `localhost:3001/api` вместо вашего реального backend URL на Render.

---

## ✅ Решение (2 минуты):

### Вариант 1: Через Render Environment Variables (правильный способ)

1. **Render Dashboard** → **Static Site (Frontend)** → **Environment**

2. **Добавьте переменную:**
   ```
   VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com/api
   ```

   **Где найти Backend URL?**
   - Render Dashboard → Web Services → `rentcontrol-backend` 
   - Скопируйте URL (например: `https://rentcontrol-backend-abc123.onrender.com`)
   - Добавьте `/api` в конце

   Пример:
   ```
   VITE_API_URL=https://rentcontrol-backend-abc123.onrender.com/api
   ```

3. **Save Changes**

4. **Manual Deploy** → **Clear build cache & deploy**

5. **Ждите 2-3 минуты**

---

### Вариант 2: Быстрый хардкод (временный фикс)

Если нужно быстро проверить, можно временно захардкодить URL:

**Файл:** `config/api.ts`

```typescript
// Временно захардкодим URL backend
const API_BASE_URL = 'https://YOUR-BACKEND-URL.onrender.com/api';
```

Замените `YOUR-BACKEND-URL` на ваш реальный URL.

Потом коммит и пуш:
```bash
cd /home/user/webapp
git add config/api.ts
git commit -m "fix: Add backend URL temporarily"
git push origin main
```

**⚠️ Не забудьте потом вернуть на:**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://YOUR-BACKEND-URL.onrender.com/api';
```

---

## 🔍 Как проверить текущий URL:

### В консоли браузера (F12):
```javascript
// Проверьте какой URL используется
console.log(import.meta.env.VITE_API_URL);
```

Должно вывести ваш backend URL, а не `undefined`.

### В Network tab (F12):
1. Откройте DevTools (F12)
2. Перейдите на вкладку Network
3. Попробуйте войти
4. Найдите запрос `/auth/login`
5. Проверьте URL - должен быть вашего backend на Render, а не localhost

---

## 📊 Правильная конфигурация:

### Frontend Environment Variables (Render Static Site):
```
VITE_API_URL=https://rentcontrol-backend-abc123.onrender.com/api
```

### Backend Environment Variables (Render Web Service):
```
CORS_ORIGIN=https://rentcontrol-frontend.onrender.com
```

---

## 🧪 Проверка после исправления:

### 1. Откройте Frontend
```
https://rentcontrol-frontend.onrender.com
```

### 2. Откройте консоль (F12)
В консоли выполните:
```javascript
fetch('https://YOUR-BACKEND-URL.onrender.com/api/health')
  .then(r => r.json())
  .then(d => console.log(d));
```

Должно вернуть:
```json
{"status":"ok","timestamp":"2026-01-15T..."}
```

### 3. Попробуйте войти
- Логин: `admin`
- Пароль: `admin123`

### 4. Проверьте Network tab
Запрос к `/api/auth/login` должен идти на ваш backend URL, а не на localhost.

---

## ⚠️ Частые ошибки:

### Ошибка 1: Забыли `/api` в конце
❌ Неправильно: `https://backend.onrender.com`  
✅ Правильно: `https://backend.onrender.com/api`

### Ошибка 2: Неправильный URL
Проверьте, что URL backend точно такой, какой указан в Render Dashboard.

### Ошибка 3: Не сделали Redeploy
После добавления Environment Variable нужно обязательно:
1. Save Changes
2. Manual Deploy → Clear build cache & deploy

### Ошибка 4: CORS ошибка
После исправления URL, если видите CORS ошибку:
- Backend → Environment → `CORS_ORIGIN=https://your-frontend.onrender.com`

---

## 🎯 Чеклист:

- [ ] Нашел Backend URL в Render Dashboard
- [ ] Добавил VITE_API_URL в Frontend Environment
- [ ] URL содержит `/api` в конце
- [ ] Сделал Save Changes
- [ ] Запустил Manual Deploy
- [ ] Дождался завершения деплоя (2-3 мин)
- [ ] Открыл Frontend в браузере
- [ ] Открыл консоль (F12) → Network tab
- [ ] Попробовал войти
- [ ] Запрос идет на правильный backend URL
- [ ] ✅ Вход работает!

---

## 📝 Примечание:

Environment Variables в Vite работают только на этапе **build time**, поэтому:
- Нужно делать **redeploy** после изменения переменных
- Переменные должны начинаться с `VITE_`
- После сборки значения "зашиты" в JS код

---

**После добавления VITE_API_URL и redeploy - сообщите результат! 🚀**
