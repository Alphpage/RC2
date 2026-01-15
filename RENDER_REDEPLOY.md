# 🔄 Быстрый перезапуск деплоя на Render

## Ваша текущая проблема решена! ✅

Исправлена ошибка: `PrismaClientInitializationError: libssl.so.1.1 not found`

### Что было исправлено:
1. ✅ Добавлен правильный `binaryTarget` в Prisma schema
2. ✅ Установлен OpenSSL 3 в Docker образе
3. ✅ Обновлена документация

---

## Что делать дальше (3 минуты):

### Вариант А: Render автоматически начнет новый деплой

1. **Откройте Render Dashboard:**
   https://dashboard.render.com

2. **Найдите ваш сервис:**
   - `rentcontrol-backend`

3. **Проверьте статус:**
   - Должен автоматически начаться новый Build (коммит `1033163`)
   - Если нет — перейдите к Варианту Б

4. **Ждите:**
   - ⏳ 5-7 минут (Docker build)

5. **Проверьте успешность:**
   ```bash
   curl https://your-backend-url.onrender.com/api/health
   ```
   
   Ожидаемый ответ:
   ```json
   {"status":"ok","timestamp":"2026-01-15T12:00:00.000Z"}
   ```

---

### Вариант Б: Ручной перезапуск (если автоматический не начался)

1. **Откройте Render Dashboard**

2. **Выберите ваш сервис** `rentcontrol-backend`

3. **Нажмите "Manual Deploy"**

4. **Выберите:**
   - ✅ **Clear build cache & deploy** (рекомендуется)
   - Или просто **Deploy latest commit**

5. **Ждите:**
   - ⏳ 5-7 минут

---

### Вариант В: Native Node.js (если Docker все еще не работает)

Если Docker build снова падает, переключитесь на Native Environment:

1. **В Render Dashboard:**
   - Settings → Runtime → **Node**

2. **Build Command:**
   ```bash
   npm install && npx prisma generate && npm run build
   ```

3. **Start Command:**
   ```bash
   npx prisma migrate deploy && npm start
   ```

4. **Save Changes** → **Manual Deploy**

**Преимущества Native:**
- ⚡ Быстрее (3-5 минут vs 5-7 минут)
- 🔧 Меньше проблем с зависимостями
- ✅ Работает стабильнее на Free tier

---

## Проверка после деплоя

### 1. Health Check
```bash
curl https://your-backend-url.onrender.com/api/health
```

### 2. Login Test
```bash
curl -X POST https://your-backend-url.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","password":"admin123"}'
```

### 3. Инициализация БД (если нужно)

В Render Dashboard → Shell:
```bash
cd server
npx prisma db seed
```

---

## Если все еще не работает

### 1. Проверьте логи:
- Render Dashboard → Logs
- Ищите ошибки после "Starting server..."

### 2. Частые проблемы:

#### ❌ Database connection error
**Решение:** Проверьте `DATABASE_URL` в Environment Variables
- Должен быть **Internal Database URL** (не External)

#### ❌ Prisma migrate failed
**Решение:** Добавьте в Start Command:
```bash
npx prisma migrate deploy && npm start
```

#### ❌ Port binding error
**Решение:** Проверьте Environment Variables:
- `PORT=3001` (должно совпадать с EXPOSE в Dockerfile)

#### ❌ CORS errors (после деплоя frontend)
**Решение:** Обновите `CORS_ORIGIN` в Environment Variables:
```
CORS_ORIGIN=https://your-frontend-url.onrender.com
```

---

## Следующие шаги после успешного деплоя backend:

1. ✅ Backend работает → Деплой Frontend
2. 📝 Следуйте **QUICK_DEPLOY.md** → Шаг 5
3. 🔗 Подключите Frontend к Backend API

---

## Полезные ссылки:

- 📚 **QUICK_DEPLOY.md** - Полная инструкция по деплою
- 🐛 **TROUBLESHOOTING.md** - Решение проблем
- 🐳 **server/DOCKER.md** - Docker конфигурация
- 📖 **server/README.md** - Backend документация
- 🔗 **GitHub:** https://github.com/Alphpage/RC2

---

## Статус коммитов:

- ✅ `1033163` - fix: Resolve Prisma OpenSSL error for Alpine Linux
- ✅ `3df1b1a` - docs: Add alternative Dockerfile and configuration

**Все готово к успешному деплою! 🚀**
