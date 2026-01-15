# 🐳 Docker Configuration Guide

## Available Dockerfiles

В проекте доступны два варианта Docker конфигурации:

### 1. `Dockerfile` (Alpine Linux) - По умолчанию ✅

**Преимущества:**
- ⚡ Меньший размер образа (~150MB vs ~300MB)
- 🚀 Быстрее скачивается и деплоится
- 💰 Меньше потребление ресурсов

**Особенности:**
- Использует `node:18-alpine`
- OpenSSL 3.x с правильными binary targets для Prisma
- Оптимизирован для production

**Когда использовать:**
- Деплой на Render, Railway, Fly.io
- Production deployment
- Когда важен размер образа

**Команды:**
```bash
# Локальная сборка
docker build -t rentcontrol-backend -f Dockerfile .

# Запуск
docker run -p 3001:3001 --env-file .env rentcontrol-backend
```

---

### 2. `Dockerfile.debian` (Debian Slim) - Альтернатива

**Преимущества:**
- 🔧 Максимальная совместимость с библиотеками
- 📦 Больше предустановленных системных пакетов
- ✅ Может решить проблемы с native dependencies

**Особенности:**
- Использует `node:18-slim` (Debian-based)
- Полная поддержка OpenSSL
- Больший размер образа

**Когда использовать:**
- Если Alpine версия не работает
- Нужны дополнительные системные библиотеки
- Development и тестирование

**Команды:**
```bash
# Локальная сборка
docker build -t rentcontrol-backend -f Dockerfile.debian .

# Запуск
docker run -p 3001:3001 --env-file .env rentcontrol-backend
```

---

## Использование на Render.com

### Вариант 1: Alpine (рекомендуется)

При создании Web Service:
- **Runtime:** Docker
- **Dockerfile Path:** `Dockerfile` (оставьте пустым или укажите явно)

### Вариант 2: Debian

При создании Web Service:
- **Runtime:** Docker
- **Dockerfile Path:** `Dockerfile.debian`

---

## Сравнение размеров образов

| Dockerfile | Base Image | Final Size | Build Time |
|------------|------------|------------|------------|
| `Dockerfile` | node:18-alpine | ~150 MB | 5-7 мин |
| `Dockerfile.debian` | node:18-slim | ~300 MB | 6-8 мин |

---

## Решение проблем

### Проблема: "libssl.so.1.1: cannot open shared object file"

**Решение:**
1. Убедитесь, что в `prisma/schema.prisma` указан правильный binary target:
   ```prisma
   generator client {
     provider      = "prisma-client-js"
     binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
   }
   ```

2. Или используйте `Dockerfile.debian` вместо `Dockerfile`

### Проблема: Docker build timeout на Free tier

**Решение:**
1. Используйте Alpine версию (быстрее)
2. Или переключитесь на Native Node.js environment (без Docker)

### Проблема: Native dependencies не компилируются

**Решение:**
Используйте `Dockerfile.debian` — больше предустановленных инструментов для компиляции

---

## Локальная разработка с Docker Compose

```bash
# Запуск всего стека (backend + PostgreSQL)
docker-compose up

# Остановка
docker-compose down

# Перезапуск с пересборкой
docker-compose up --build
```

---

## Production Best Practices

### 1. Multi-stage builds ✅
Оба Dockerfile используют multi-stage builds для минимизации размера

### 2. Security
```dockerfile
# Не запускайте от root (опционально)
USER node
```

### 3. Health checks
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
```

### 4. Build cache optimization
- Копируем `package*.json` отдельно для кэширования зависимостей
- Prisma generate запускается отдельно

---

## Дополнительная информация

- 📚 [Prisma Docker Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-docker)
- 🐋 [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- ⚡ [Alpine vs Debian](https://devopsspiral.com/articles/docker/alpine-vs-slim/)
