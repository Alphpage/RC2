# 🔍 Диагностика: Route not found

## Текущее состояние:

✅ **Health check работает:**
```
https://rentcontrol-backend.onrender.com/api/health
{"status":"ok","timestamp":"2026-01-17T19:28:22.311Z"}
```

❌ **Другие роуты не работают:**
```
/api/admin/seed → {"error":"Route not found"}
/api/auth/login → {"error":"Route not found"}
```

---

## 🚨 ПРОБЛЕМА: Старая версия кода все еще запущена!

Health check работает, потому что он определен в `routes/index.ts`, но другие роуты не работают.

---

## ✅ РЕШЕНИЕ: Принудительный redeploy

### Вариант 1: Manual Deploy (рекомендуется)

1. **Render Dashboard** → **rentcontrol-backend**
2. Нажмите **"Manual Deploy"** (справа вверху)
3. Выберите **"Clear build cache & deploy"**
4. Дождитесь завершения (~5-7 минут)

---

### Вариант 2: Проверьте Start Command

Возможно, старый Start Command все еще с ошибкой seed.

**Render Dashboard** → **rentcontrol-backend** → **Settings**

**Start Command должен быть:**
```bash
npm start
```

**НЕ:**
```bash
npx prisma migrate deploy && npx prisma db seed || true && npm start
```

Если там seed - измените на `npm start` и Save.

---

### Вариант 3: Проверьте логи деплоя

**Render Dashboard** → **rentcontrol-backend** → **Logs**

Ищите:
```
🚀 Server running on port 3001
📍 API available at http://localhost:3001/api
```

Если видите ошибки - покажите их мне!

---

## 🧪 После redeploy проверьте:

### 1. Health check (должен работать)
```bash
curl https://rentcontrol-backend.onrender.com/api/health
```

### 2. Admin seed endpoint
```bash
curl -X POST https://rentcontrol-backend.onrender.com/api/admin/seed
```

**Должен вернуть JSON с данными, НЕ "Route not found"!**

### 3. Login (сначала нужен seed!)
```bash
curl -X POST https://rentcontrol-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","password":"admin123"}'
```

---

## 📋 Чеклист диагностики:

- [ ] Проверил Start Command (должен быть `npm start`)
- [ ] Сделал Manual Deploy → Clear build cache & deploy
- [ ] Дождался завершения деплоя (5-7 минут)
- [ ] Проверил логи - нет ошибок
- [ ] Проверил `/api/health` - работает
- [ ] Проверил `/api/admin/seed` - теперь возвращает JSON
- [ ] Запустил seed
- [ ] Проверил login - работает
- [ ] Открыл frontend - вошел в систему

---

## 🎯 Быстрое решение:

1. **Manual Deploy** → **Clear build cache & deploy**
2. Ждем 5-7 минут
3. Проверяем `/api/admin/seed`
4. Должно работать!

---

**Сделайте Manual Deploy и сообщите результат! 🚀**
