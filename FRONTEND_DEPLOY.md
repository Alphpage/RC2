# 🎨 Frontend Deployment Guide (Render.com)

## ✅ Проблема JSX исправлена!

Исправлена ошибка: `The character ">" is not valid inside a JSX element`

**Коммит:** `537ea63` - fix: Escape arrow operator in JSX for production build

---

## 📋 Полная инструкция по деплою Frontend

### Шаг 1: Создание Static Site на Render

1. **Откройте Render Dashboard:**
   https://dashboard.render.com

2. **Нажмите "New +" → "Static Site"**

3. **Подключите репозиторий:**
   - Выберите ваш репозиторий **RC2**
   - Нажмите "Connect"

4. **Настройте параметры:**

   | Параметр | Значение |
   |----------|----------|
   | **Name** | `rentcontrol-frontend` |
   | **Branch** | `main` |
   | **Root Directory** | *(оставьте пустым)* |
   | **Build Command** | `npm install && npm run build` |
   | **Publish Directory** | `dist` |

5. **Нажмите "Create Static Site"**

6. **⏳ Ждите:** 2-3 минуты

---

### Шаг 2: Настройка Environment Variables (опционально)

Если вам нужно настроить API URL для frontend:

1. **В настройках Static Site → Environment**

2. **Добавьте переменные:**

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://your-backend-url.onrender.com/api` |

3. **Redeploy** после изменения переменных

**Примечание:** Для текущего проекта переменные окружения не обязательны, так как API URL можно настроить в коде.

---

### Шаг 3: Обновление CORS на Backend

После получения Frontend URL, обновите Backend настройки:

1. **Откройте Backend Service** (`rentcontrol-backend`)

2. **Settings → Environment**

3. **Обновите переменную:**
   ```
   CORS_ORIGIN=https://rentcontrol-frontend.onrender.com
   ```

4. **Save Changes** → сервис автоматически перезапустится

---

### Шаг 4: Интеграция Frontend с Backend API

Обновите файл `services/geminiService.ts` или создайте конфигурацию:

```typescript
// src/config/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     'https://rentcontrol-backend.onrender.com/api';

export default API_BASE_URL;
```

Затем используйте в запросах:
```typescript
import API_BASE_URL from './config/api';

const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ login, password })
});
```

---

## 🧪 Проверка деплоя

### 1. Frontend доступен
```bash
curl -I https://rentcontrol-frontend.onrender.com
# HTTP/1.1 200 OK
```

### 2. Проверьте в браузере:
- Откройте `https://rentcontrol-frontend.onrender.com`
- Должна открыться страница авторизации
- Попробуйте войти: `admin` / `admin123`

### 3. Проверьте консоль браузера (F12)
- Не должно быть CORS ошибок
- API запросы должны идти на ваш backend URL

---

## ⚠️ Частые проблемы

### 1. ❌ Build fails: "The character '>' is not valid"

**Решение:** Уже исправлено в коммите `537ea63`

Если проблема повторяется:
```bash
git pull origin main
```

### 2. ❌ CORS Error: "No 'Access-Control-Allow-Origin' header"

**Причина:** Backend не настроен для Frontend URL

**Решение:**
1. Backend → Environment → `CORS_ORIGIN`
2. Укажите Frontend URL: `https://rentcontrol-frontend.onrender.com`
3. Сохраните и дождитесь перезапуска backend

### 3. ❌ API requests fail: "Failed to fetch"

**Причина:** Неправильный API URL или backend не работает

**Решение:**
1. Проверьте backend: `curl https://your-backend.onrender.com/api/health`
2. Проверьте API URL в frontend коде
3. Убедитесь, что backend уже развернут и работает

### 4. ❌ Static Site не обновляется

**Решение:**
1. Dashboard → Static Site → Manual Deploy
2. Или очистите кэш: **Clear build cache & deploy**

### 5. ❌ 404 на роутах (например, `/dashboard`)

**Причина:** SPA routing не настроен

**Решение:** Добавьте `_redirects` файл:
```bash
# В корне проекта создайте public/_redirects
/*    /index.html   200
```

Затем обновите `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  publicDir: 'public', // Добавьте эту строку
})
```

---

## 📊 Структура проекта для деплоя

```
/home/user/webapp/
├── components/           # React компоненты
├── services/             # API services
├── dist/                 # Build output (создается при npm run build)
├── index.html            # Entry point
├── index.tsx             # React entry
├── package.json          # Frontend dependencies
├── vite.config.ts        # Vite configuration
└── tsconfig.json         # TypeScript config
```

---

## 🚀 После успешного деплоя

### 1. Инициализируйте БД (если еще не сделано)

Backend → Shell:
```bash
cd server
npx prisma db seed
```

### 2. Тестовые пользователи:

| Логин | Пароль | Роль |
|-------|--------|------|
| `admin` | `admin123` | ADMIN |
| `manager` | `manager123` | MANAGER |
| `supervisor` | `supervisor123` | SUPERVISOR |

### 3. Проверьте функционал:
- ✅ Авторизация
- ✅ Просмотр точек проката
- ✅ Создание/редактирование отчетов
- ✅ Управление сотрудниками
- ✅ Расчет зарплаты
- ✅ Аудит

---

## 📈 Мониторинг и поддержка

### Free Tier ограничения Render.com:
- ⏰ Сервисы засыпают после 15 минут неактивности
- 🐌 Первый запрос после сна: 30-60 секунд
- 💾 Static Site: unlimited bandwidth
- 📊 Build minutes: 500 минут/месяц (Free tier)

### Рекомендации:
1. **Для production:** Upgrade до Paid tier ($7/месяц backend + frontend free)
2. **Мониторинг:** Настройте [UptimeRobot](https://uptimerobot.com) для ping каждые 5 минут
3. **Кастомный домен:** Render поддерживает бесплатно (Settings → Custom Domain)

---

## 🔗 Полезные ссылки:

- 🌐 **GitHub:** https://github.com/Alphpage/RC2
- 📖 **Backend API:** https://your-backend.onrender.com/api/health
- 🎨 **Frontend:** https://rentcontrol-frontend.onrender.com
- 📚 **Документация:**
  - QUICK_DEPLOY.md - Быстрый деплой
  - TROUBLESHOOTING.md - Решение проблем
  - DEPLOYMENT.md - Полное руководство
  - server/API_REFERENCE.md - API документация

---

## ✅ Чеклист успешного деплоя:

- ✅ Backend развернут и работает
- ✅ PostgreSQL настроен и доступен
- ✅ Frontend собирается без ошибок
- ✅ Frontend развернут на Render
- ✅ CORS настроен правильно
- ✅ API запросы работают
- ✅ БД инициализирована с seed данными
- ✅ Тестовые пользователи работают

**Готово! Ваше приложение опубликовано и работает! 🎉**

---

## 🆘 Нужна помощь?

Если что-то не работает:
1. Проверьте **TROUBLESHOOTING.md**
2. Посмотрите логи в Render Dashboard
3. Проверьте консоль браузера (F12)
4. Убедитесь, что все Environment Variables настроены правильно
