# ⚠️ Известные проблемы при деплое

## 🔴 Проблема: Frontend Vite build error - Invalid JSX character

### Симптомы:
```
error during build:
[vite:esbuild] Transform failed with 1 error:
The character ">" is not valid inside a JSX element
```

### Причина:
- Использование символов `->`, `<-`, `>=`, `<=` напрямую в JSX тексте
- ESBuild интерпретирует их как операторы, а не как текст

### ✅ Решение (уже исправлено):
В коммите `537ea63` исправлено:
```tsx
// ❌ Неправильно:
-> Требовать:

// ✅ Правильно:
{'->'} Требовать:
```

### Если проблема повторяется:
1. **Найдите проблемные символы:**
   ```bash
   grep -n " -> " components/*.tsx
   grep -n " >= " components/*.tsx
   grep -n " <= " components/*.tsx
   ```

2. **Оберните в фигурные скобки:**
   ```tsx
   {'->'} или {'→'} // Unicode стрелка
   {'>='} 
   {'<='} 
   ```

3. **Или используйте HTML entities:**
   ```tsx
   &rarr; // →
   &larr; // ←
   &ge;   // ≥
   &le;   // ≤
   ```

---

## 🔴 Проблема: Prisma OpenSSL error в Alpine Linux

### Симптомы:
```
PrismaClientInitializationError: Unable to require `/app/node_modules/.prisma/client/libquery_engine-linux-musl.so.node`.
Error: libssl.so.1.1: cannot open shared object file: No such file or directory
```

### Причина:
- Alpine Linux использует OpenSSL 3.x, а Prisma искал OpenSSL 1.1.x
- Неправильный `binaryTarget` в Prisma schema

### ✅ Решение (уже исправлено):
1. В `prisma/schema.prisma` добавлен правильный `binaryTarget`:
   ```prisma
   generator client {
     provider      = "prisma-client-js"
     binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
   }
   ```

2. В `Dockerfile` установлен OpenSSL 3:
   ```dockerfile
   RUN apk add --no-cache openssl libssl3
   ```

### Если проблема повторяется:
1. **Проверьте binaryTargets в schema.prisma**
2. **Очистите build cache на Render:**
   - Dashboard → Service → Manual Deploy → Clear build cache & deploy
3. **Регенерируйте Prisma Client локально:**
   ```bash
   cd server
   npx prisma generate
   git add .
   git commit -m "Regenerate Prisma client"
   git push
   ```

---

## Проблема: TypeScript compilation errors в Docker build

### Симптомы:
```
error TS2769: No overload matches this call
error TS6133: 'param' is declared but its value is never read
npm run build failed with exit code 2
```

### Причина:
- JWT type definitions conflict с expiresIn parameter
- Strict TypeScript settings (noUnusedLocals, noUnusedParameters)

### ✅ Решение (уже исправлено):
Исправлено в коммите `94b4292`:
- Добавлен `@ts-ignore` для JWT type issue
- Отключены `noUnusedLocals` и `noUnusedParameters` в tsconfig.json

### Если проблема повторяется:
Проверьте что у вас последняя версия кода:
```bash
git pull origin main
```

---

## Проблема: Docker build fails с "npm ci requires package-lock.json"

### Симптомы:
```
npm error The `npm ci` command can only install with an existing package-lock.json
```

### Причина:
Файл `package-lock.json` отсутствует в директории `server/`

### ✅ Решение (уже исправлено):
Файл `server/package-lock.json` добавлен в репозиторий в коммите `1c7042c`.

### Если проблема повторяется:

1. **Проверьте наличие файла:**
   ```bash
   ls -la server/package-lock.json
   ```

2. **Если файл отсутствует, создайте его:**
   ```bash
   cd server
   npm install
   git add package-lock.json
   git commit -m "Add package-lock.json"
   git push
   ```

3. **Пересоздайте деплой на Render:**
   - Перейдите в настройки вашего Web Service
   - Нажмите "Manual Deploy" → "Clear build cache & deploy"

---

## Проблема: Render build timeout

### Симптомы:
Build превышает 15 минут на FREE tier

### ✅ Решение:

**Вариант 1:** Используйте простой build без Docker:
- В настройках Render измените на "Native Environment"
- Build Command:
  ```bash
  cd server && npm install && npx prisma generate && npm run build
  ```
- Start Command:
  ```bash
  cd server && npx prisma migrate deploy && npm start
  ```

**Вариант 2:** Оптимизируйте Dockerfile (уже оптимизирован)

---

## Проблема: Database connection refused

### Симптомы:
```
Error: P1001: Can't reach database server
```

### ✅ Решение:

1. **Проверьте DATABASE_URL:**
   - Должен быть **Internal Database URL** (не External!)
   - Формат: `postgresql://user:pass@internal-host:5432/db`

2. **Убедитесь, что БД создана:**
   - Перейдите в PostgreSQL dashboard
   - Проверьте статус: должен быть "Available"

3. **Проверьте регионы:**
   - Backend и БД должны быть в одном регионе (Frankfurt)

---

## Проблема: Prisma migrations fail

### Симптомы:
```
Error: Migration engine failed to start
```

### ✅ Решение:

**Проверьте Start Command:**
```bash
npx prisma migrate deploy && npm start
```

**Если нужно сбросить БД:**
1. Откройте Shell в Render
2. Выполните:
   ```bash
   cd server
   npx prisma migrate reset --force
   npx prisma db seed
   ```

---

## Проблема: Frontend не подключается к Backend

### Симптомы:
- CORS errors в консоли
- Network errors при login

### ✅ Решение:

1. **Проверьте VITE_API_URL в Frontend:**
   - Должен быть полный URL: `https://your-backend.onrender.com`
   - БЕЗ `/api` в конце!

2. **Проверьте CORS_ORIGIN в Backend:**
   - Должен быть URL фронтенда: `https://your-frontend.onrender.com`
   - Или `*` для тестирования

3. **Проверьте доступность backend:**
   ```bash
   curl https://your-backend.onrender.com/api/health
   ```

---

## Проблема: Free tier засыпает

### Симптомы:
- Первый запрос занимает 30-60 секунд
- "Service unavailable" при неактивности

### ✅ Решение:

**Это нормально для FREE tier!**

**Варианты:**
1. Используйте платный план ($7/мес) - сервис не засыпает
2. Настройте пинг каждые 10 минут через UptimeRobot
3. Добавьте loading состояние во frontend при первом запросе

---

## Проблема: Out of memory

### Симптомы:
```
JavaScript heap out of memory
```

### ✅ Решение:

1. **Увеличьте Node memory:**
   В Start Command добавьте:
   ```bash
   NODE_OPTIONS="--max-old-space-size=512" npm start
   ```

2. **Оптимизируйте build:**
   - Убедитесь, что devDependencies не устанавливаются
   - Проверьте размер образа

---

## Проблема: Environment variables не работают

### Симптомы:
- JWT_SECRET undefined
- DATABASE_URL не подхватывается

### ✅ Решение:

1. **Проверьте что все переменные добавлены:**
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=<internal-url>
   JWT_SECRET=<your-secret>
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=<frontend-url>
   ```

2. **Сохраните изменения:**
   - После добавления переменных нажмите "Save"
   - Render автоматически перезапустит сервис

3. **Проверьте в Shell:**
   ```bash
   echo $DATABASE_URL
   echo $JWT_SECRET
   ```

---

## Быстрая диагностика

### Команды для проверки в Render Shell:

```bash
# Проверить Node версию
node --version

# Проверить переменные окружения
env | grep DATABASE
env | grep JWT

# Проверить Prisma
cd server
npx prisma db pull

# Проверить подключение к БД
npx prisma studio

# Посмотреть логи
tail -f /var/log/*.log
```

---

## Контакты для помощи

- **Render Docs:** https://render.com/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **GitHub Issues:** https://github.com/Alphpage/RC2/issues

---

## Полезные команды для локальной отладки

```bash
# Тест Docker локально
cd server
docker build -t rentcontrol-backend .
docker run -p 3001:3001 rentcontrol-backend

# Тест подключения к БД
npx prisma studio

# Проверка TypeScript
npx tsc --noEmit

# Локальный запуск
npm run dev
```

---

**Обновлено:** 2026-01-15
**Версия:** 1.0.1
