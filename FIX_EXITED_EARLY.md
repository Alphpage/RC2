# 🚨 FIX: Application exited early

## Проблема:
```
==> Application exited early
```

Start Command пытается запустить TypeScript seed, но `ts-node` не установлен в production.

---

## ✅ РЕШЕНИЕ: Упрощенный Start Command

### Вариант 1: Без seed в Start Command (проще)

Используйте этот Start Command:
```bash
npm start
```

А seed запустим через API endpoint (создам ниже).

---

### Вариант 2: С seed через Node.js (если хотите автоматический seed)

Используйте:
```bash
npx prisma migrate deploy && node -e "const {PrismaClient}=require('@prisma/client');const bcrypt=require('bcryptjs');const p=new PrismaClient();async function seed(){const c=await p.user.count();if(c>0){console.log('DB has data, skip');return}console.log('Seeding...');const users=[{login:'admin',password:await bcrypt.hash('admin123',10),name:'Администратор',role:'ADMIN',assignedPointIds:[]},{login:'manager',password:await bcrypt.hash('manager123',10),name:'Менеджер',role:'MANAGER',assignedPointIds:[]},{login:'supervisor',password:await bcrypt.hash('supervisor123',10),name:'Управляющий',role:'SUPERVISOR',assignedPointIds:[]}];for(const u of users){await p.user.upsert({where:{login:u.login},update:{},create:u});console.log('User:'+u.login)}console.log('Done!')}seed().then(()=>p.\$disconnect()).catch(e=>{console.error(e);process.exit(0)})" && npm start
```

⚠️ Это длинная команда, но она работает без ts-node!

---

## 🎯 РЕКОМЕНДАЦИЯ: Вариант 3 - API Endpoint для seed

Это самый простой и надежный способ!

### Создам специальный endpoint `/api/seed` который можно вызвать один раз.

---

## 📝 Что делать СЕЙЧАС:

### Шаг 1: Временно упростите Start Command

**Render Dashboard** → **Backend Settings** → **Start Command**:

```bash
npm start
```

**Save Changes** → Дождитесь успешного деплоя.

### Шаг 2: Я создам API endpoint для seed

Тогда вы сможете просто открыть в браузере:
```
https://rentcontrol-backend.onrender.com/api/admin/seed
```

И seed выполнится!

---

## 🔧 Создаю seed endpoint прямо сейчас...
