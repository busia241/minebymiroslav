# ⚡ Быстрый старт

## 1️⃣ Загрузить на GitHub

```bash
cd minedrop-site
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ВАШ-USERNAME/minedrop-site.git
git push -u origin main
```

## 2️⃣ Деплой на Vercel

1. Зайдите на [vercel.com](https://vercel.com) → Войдите через GitHub
2. **"Add New..."** → **"Project"**
3. Выберите репозиторий → **"Deploy"**
4. Скопируйте URL (например: `https://minedrop-site-abc123.vercel.app`)

## 3️⃣ Обновить расширение

Замените `ваш-проект.vercel.app` на ваш реальный URL:

### `by miroslav/manifest.json`:
```json
"host_permissions": ["*://ваш-проект.vercel.app/*", ...]
"externally_connectable": {"matches": ["*://ваш-проект.vercel.app/*"]}
```

### `by miroslav/background.js`:
```javascript
const SERVER_HOST = "https://ваш-проект.vercel.app";
```

## 4️⃣ Готово! 🎉

Откройте `https://ваш-проект.vercel.app/minedrop` и проверьте работу.

---

📖 Подробная инструкция: [DEPLOY.md](./DEPLOY.md)

