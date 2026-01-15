# 🚀 Руководство по публикации RentControl Pro

Полное руководство по деплою приложения на различных платформах.

## 📋 Содержание

- [Вариант 1: Render.com (Рекомендуется)](#вариант-1-rendercom-рекомендуется)
- [Вариант 2: Railway.app](#вариант-2-railwayapp)
- [Вариант 3: Docker на VPS](#вариант-3-docker-на-vps)
- [Вариант 4: Vercel + Supabase](#вариант-4-vercel--supabase)

---

## Вариант 1: Render.com (Рекомендуется)

### 💰 Стоимость
- **FREE** - PostgreSQL + Backend + Frontend на бесплатном плане
- Автоматический деплой из GitHub
- SSL сертификаты включены

### 📝 Шаги развертывания

#### 1. Подготовка проекта

Убедитесь, что все изменения закоммичены и отправлены на GitHub:

```bash
cd /home/user/webapp
git add .
git commit -m "chore: Add production deployment configuration"
git push origin main
```

#### 2. Регистрация на Render.com

1. Перейдите на [render.com](https://render.com)
2. Зарегистрируйтесь через GitHub
3. Подключите ваш репозиторий RC2

#### 3. Создание PostgreSQL базы данных

1. На дашборде Render нажмите **"New +"**
2. Выберите **"PostgreSQL"**
3. Настройте:
   - **Name:** `rentcontrol-db`
   - **Database:** `rentcontrol_db`
   - **User:** `rentcontrol`
   - **Region:** Frankfurt (или ближайший к вам)
   - **Plan:** Free
4. Нажмите **"Create Database"**
5. Дождитесь создания (1-2 минуты)
6. Скопируйте **Internal Database URL** (будет использоваться для backend)

#### 4. Деплой Backend API

1. Нажмите **"New +"** → **"Web Service"**
2. Выберите репозиторий **RC2**
3. Настройте:
   - **Name:** `rentcontrol-backend`
   - **Region:** Frankfurt
   - **Branch:** `main`
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:**
     ```bash
     npm install && npx prisma generate && npm run build
     ```
   - **Start Command:**
     ```bash
     npx prisma migrate deploy && npm start
     ```
   - **Plan:** Free

4. Добавьте Environment Variables:
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=<Internal Database URL из шага 3>
   JWT_SECRET=<сгенерируйте случайную строку>
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=*
   ```

5. Нажмите **"Create Web Service"**
6. Дождитесь деплоя (5-10 минут)
7. Скопируйте URL backend (например: `https://rentcontrol-backend.onrender.com`)

#### 5. Деплой Frontend

1. Нажмите **"New +"** → **"Static Site"**
2. Выберите репозиторий **RC2**
3. Настройте:
   - **Name:** `rentcontrol-frontend`
   - **Region:** Frankfurt
   - **Branch:** `main`
   - **Root Directory:** (оставьте пустым или `/`)
   - **Build Command:**
     ```bash
     npm install && npm run build
     ```
   - **Publish Directory:** `dist`

4. Добавьте Environment Variables:
   ```
   VITE_API_URL=<URL backend из шага 4>
   ```

5. Нажмите **"Create Static Site"**
6. Дождитесь деплоя (3-5 минут)

#### 6. Финальные настройки

1. Обновите CORS в backend:
   - Вернитесь к настройкам `rentcontrol-backend`
   - Измените `CORS_ORIGIN` на URL вашего frontend
   - Сохраните изменения

2. Проверьте работу приложения:
   - Откройте URL frontend
   - Попробуйте войти: `admin` / `admin123`

#### 7. Инициализация базы данных (опционально)

Если база данных пустая, выполните seed:

1. Перейдите в **Shell** вашего backend на Render
2. Выполните:
   ```bash
   cd server
   npx prisma db seed
   ```

### ✅ Готово!

Ваше приложение опубликовано и доступно по адресу:
- **Frontend:** `https://rentcontrol-frontend.onrender.com`
- **Backend API:** `https://rentcontrol-backend.onrender.com/api`

---

## Вариант 2: Railway.app

### 💰 Стоимость
- $5 бесплатных кредитов каждый месяц
- После - $0.01 за GB-час

### 📝 Шаги развертывания

#### 1. Регистрация на Railway

1. Перейдите на [railway.app](https://railway.app)
2. Зарегистрируйтесь через GitHub
3. Создайте новый проект

#### 2. Добавление PostgreSQL

1. В проекте нажмите **"+ New"**
2. Выберите **"Database"** → **"PostgreSQL"**
3. База данных создастся автоматически

#### 3. Деплой Backend

1. Нажмите **"+ New"** → **"GitHub Repo"**
2. Выберите репозиторий **RC2**
3. Railway автоматически обнаружит Node.js проект
4. Настройте:
   - **Root Directory:** `server`
   - **Start Command:** `npm run start`

5. Добавьте переменные окружения:
   - Подключите PostgreSQL (кнопка Connect)
   - Добавьте остальные переменные:
     ```
     NODE_ENV=production
     JWT_SECRET=<случайная строка>
     JWT_EXPIRES_IN=7d
     ```

6. Настройте Deploy:
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npx prisma migrate deploy && npm start`

#### 4. Деплой Frontend

1. Нажмите **"+ New"** → **"GitHub Repo"**
2. Выберите тот же репозиторий
3. Настройте:
   - **Root Directory:** оставьте пустым
   - **Build Command:** `npm install && npm run build`

4. Добавьте переменные:
   ```
   VITE_API_URL=<URL backend из Railway>
   ```

5. Deploy!

### ✅ Готово!

---

## Вариант 3: Docker на VPS

### 💰 Стоимость
- VPS от $5/месяц (DigitalOcean, Hetzner, etc.)

### 📝 Шаги развертывания

#### 1. Подготовка VPS

```bash
# Подключитесь к VPS
ssh root@your-server-ip

# Установите Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установите Docker Compose
apt-get install docker-compose-plugin
```

#### 2. Клонируйте репозиторий

```bash
git clone https://github.com/Alphpage/RC2.git
cd RC2
```

#### 3. Настройте переменные окружения

```bash
# Создайте .env файл
cat > .env << EOF
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://your-domain.com
EOF
```

#### 4. Запустите приложение

```bash
docker-compose up -d
```

#### 5. Настройте Nginx (опционально)

```bash
apt-get install nginx

# Создайте конфигурацию
cat > /etc/nginx/sites-available/rentcontrol << EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header Host \$host;
    }
}
EOF

ln -s /etc/nginx/sites-available/rentcontrol /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 6. Настройте SSL с Let's Encrypt

```bash
apt-get install certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

### ✅ Готово!

---

## Вариант 4: Vercel + Supabase

### 💰 Стоимость
- **FREE** - Frontend на Vercel
- **FREE** - PostgreSQL на Supabase (500MB)
- Backend нужно деплоить отдельно (Render/Railway)

### 📝 Шаги развертывания

#### 1. Деплой Frontend на Vercel

1. Перейдите на [vercel.com](https://vercel.com)
2. Импортируйте репозиторий из GitHub
3. Настройте:
   - **Root Directory:** (оставьте пустым)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. Добавьте Environment Variable:
   ```
   VITE_API_URL=<URL вашего backend>
   ```

5. Deploy!

#### 2. Создайте базу данных на Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Дождитесь создания базы данных
4. Скопируйте Connection String (в настройках Database)

#### 3. Деплой Backend (Render/Railway)

Используйте инструкции из Варианта 1 или 2, но:
- Вместо создания БД на Render/Railway
- Используйте Connection String из Supabase в `DATABASE_URL`

### ✅ Готово!

---

## 📊 Сравнение платформ

| Платформа | Стоимость | Сложность | БД | SSL | Auto Deploy |
|-----------|-----------|-----------|----|----|-------------|
| **Render.com** | FREE | ⭐ Легко | ✅ PostgreSQL | ✅ | ✅ |
| **Railway.app** | $5/мес | ⭐ Легко | ✅ PostgreSQL | ✅ | ✅ |
| **VPS + Docker** | $5+/мес | ⭐⭐⭐ Сложно | ✅ Любая | ⚙️ Настройка | ⚙️ CI/CD |
| **Vercel + Supabase** | FREE | ⭐⭐ Средне | ✅ PostgreSQL | ✅ | ✅ |

---

## 🔧 Troubleshooting

### Backend не запускается

1. Проверьте логи на платформе
2. Убедитесь, что `DATABASE_URL` правильный
3. Проверьте, что Prisma migrations выполнились

### Frontend не подключается к Backend

1. Проверьте `VITE_API_URL` в настройках frontend
2. Проверьте CORS настройки в backend
3. Убедитесь, что backend доступен по указанному URL

### База данных пустая

Выполните seed:
```bash
# На Render/Railway в Shell
npx prisma db seed

# Локально
cd server
npm run prisma:seed
```

### Ошибки миграций Prisma

```bash
# Сбросить миграции (ВНИМАНИЕ: удалит данные!)
npx prisma migrate reset

# Создать новую миграцию
npx prisma migrate dev --name init

# Применить миграции в production
npx prisma migrate deploy
```

---

## 🎉 Поздравляем!

Ваше приложение RentControl Pro опубликовано и доступно онлайн! 🚀

Для production использования рекомендуется:
- ✅ Настроить мониторинг (UptimeRobot, Pingdom)
- ✅ Настроить резервное копирование БД
- ✅ Добавить rate limiting
- ✅ Настроить логирование ошибок (Sentry)
- ✅ Добавить аналитику

---

**Нужна помощь?** Создайте Issue на GitHub или свяжитесь с командой поддержки выбранной платформы.
