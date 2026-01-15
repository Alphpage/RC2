# 🚀 Быстрый старт Backend API

## Шаг 1: Установка PostgreSQL

### macOS (через Homebrew)
```bash
brew install postgresql@14
brew services start postgresql@14
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Windows
Скачайте и установите с https://www.postgresql.org/download/windows/

## Шаг 2: Создание базы данных

```bash
# Подключитесь к PostgreSQL
psql -U postgres

# Создайте базу данных
CREATE DATABASE rentcontrol_db;

# Создайте пользователя (опционально)
CREATE USER rentuser WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE rentcontrol_db TO rentuser;

# Выйдите
\q
```

## Шаг 3: Установка зависимостей

```bash
cd server
npm install
```

## Шаг 4: Настройка .env

```bash
cp .env.example .env
```

Отредактируйте `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/rentcontrol_db?schema=public"
JWT_SECRET=your-random-secret-key-here
```

## Шаг 5: Миграции Prisma

```bash
# Генерация Prisma Client
npm run prisma:generate

# Создание таблиц в БД
npm run prisma:migrate

# Откройте Prisma Studio для просмотра БД
npm run prisma:studio
```

## Шаг 6: Создание первого пользователя

Откройте Prisma Studio:
```bash
npm run prisma:studio
```

Перейдите в таблицу `User` и создайте пользователя:
- **login**: `admin`
- **password**: используйте хэш bcrypt (см. ниже)
- **name**: `Администратор`
- **role**: `ADMIN`
- **assignedPointIds**: `[]`

### Генерация хэша пароля

Создайте временный файл `hash.js`:
```javascript
const bcrypt = require('bcryptjs');
const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

Запустите:
```bash
node hash.js
```

Используйте полученный хэш в поле `password`.

## Шаг 7: Запуск сервера

```bash
npm run dev
```

Сервер запустится на: `http://localhost:3001`

## Шаг 8: Тестирование API

### Тест 1: Health Check
```bash
curl http://localhost:3001/api/health
```

### Тест 2: Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","password":"admin123"}'
```

Вы получите токен. Сохраните его!

### Тест 3: Получение точек
```bash
curl http://localhost:3001/api/points \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🎉 Готово!

Backend API работает и готов к использованию!

## Следующие шаги

1. Создайте тестовые данные через Prisma Studio
2. Интегрируйте API с фронтендом
3. Добавьте контроллеры для остальных сущностей (графики, отчеты, выручка)

## Проблемы?

### Ошибка подключения к БД
- Проверьте, что PostgreSQL запущен: `pg_isready`
- Проверьте `DATABASE_URL` в `.env`

### Prisma ошибки
- Удалите `node_modules` и `package-lock.json`
- Переустановите: `npm install`
- Перезапустите миграции: `npm run prisma:migrate`

### JWT ошибки
- Убедитесь, что `JWT_SECRET` установлен в `.env`
- Проверьте формат токена: `Authorization: Bearer <token>`
