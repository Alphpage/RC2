# RentControl Pro - Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Code Quality
- [ ] Все тесты пройдены
- [ ] Нет console.log в production коде
- [ ] TypeScript ошибки исправлены
- [ ] ESLint warnings проверены

### 2. Environment Variables
- [ ] `.env.example` обновлен
- [ ] Production secrets сгенерированы
- [ ] `DATABASE_URL` настроен
- [ ] `JWT_SECRET` сгенерирован (минимум 32 символа)
- [ ] `CORS_ORIGIN` настроен

### 3. Database
- [ ] Prisma schema актуальна
- [ ] Миграции созданы
- [ ] Seed данные подготовлены (опционально)

### 4. Security
- [ ] Пароли захешированы (bcrypt)
- [ ] JWT токены защищены
- [ ] CORS правильно настроен
- [ ] Rate limiting добавлен (опционально)
- [ ] SQL injection защита (Prisma ORM)

### 5. Documentation
- [ ] README.md обновлен
- [ ] API_REFERENCE.md актуален
- [ ] DEPLOYMENT.md создан

---

## 🚀 Deployment Steps

### For Render.com

1. **Create PostgreSQL Database**
   ```
   Name: rentcontrol-db
   Plan: Free
   Region: Frankfurt
   ```

2. **Deploy Backend**
   ```
   Service: Web Service
   Name: rentcontrol-backend
   Root: server
   Build: npm install && npx prisma generate && npm run build
   Start: npx prisma migrate deploy && npm start
   ```

3. **Deploy Frontend**
   ```
   Service: Static Site
   Name: rentcontrol-frontend
   Root: /
   Build: npm install && npm run build
   Publish: dist
   ```

4. **Configure Environment Variables**
   - Backend: DATABASE_URL, JWT_SECRET, CORS_ORIGIN
   - Frontend: VITE_API_URL

5. **Test Deployment**
   - [ ] Health check: `/api/health`
   - [ ] Login works: `admin` / `admin123`
   - [ ] API endpoints accessible
   - [ ] Frontend loads correctly

---

## 📊 Post-Deployment

### Monitoring
- [ ] Setup uptime monitoring (UptimeRobot)
- [ ] Configure error tracking (Sentry)
- [ ] Enable logging

### Backup
- [ ] Database backup configured
- [ ] Backup schedule set

### Performance
- [ ] CDN configured (optional)
- [ ] Caching enabled (optional)
- [ ] Compression enabled

---

## 🔧 Rollback Plan

If deployment fails:

1. **Check logs** on platform dashboard
2. **Verify environment variables**
3. **Check database connection**
4. **Rollback to previous version** if needed

---

## 📞 Support

- Render.com: https://render.com/docs
- Railway.app: https://docs.railway.app
- GitHub Issues: https://github.com/Alphpage/RC2/issues

---

## 🎉 Success Criteria

Deployment is successful when:

- ✅ Backend API responds at `/api/health`
- ✅ Frontend loads without errors
- ✅ Login works with test credentials
- ✅ Database connection established
- ✅ All API endpoints functional
- ✅ No console errors in browser

---

**Last Updated:** 2026-01-15
