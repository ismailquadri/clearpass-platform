# 🚀 ClearPass Demo Deployment - Quick Start

## 🔐 Your Secure Secrets (SAVE THESE!)

```
JWT_SECRET=4035f2fa554ed94d86db0a7f84c740c3005deacf387de78418e587fe82bdb0e2
JWT_REFRESH_SECRET=68742444f8c9854f8cf1987af14013b77ec0ab3ae6c51db18d4e4ce7888565d9
SESSION_SECRET=c654bc9ad558ebaa835437f1c2077fa0512eac05a090262a51a59b568b427b38
ENCRYPTION_KEY=91011fbc3954534e104618894007dee546c226e2bb2d7bdf0383d0f4f13f827a
```

---

## ⚡ Immediate Next Steps (30 minutes)

### **Step 1: Set up Railway Account**

1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project from your `clearpass` GitHub repo

### **Step 2: Add PostgreSQL**

1. In Railway project, click "+ New Service"
2. Select "PostgreSQL"
3. Wait for it to provision

### **Step 3: Configure Backend**

1. Click your backend service
2. Settings → Set root directory to `backend`
3. Variables → Add these:
   - Copy the secrets above
   - DATABASE_URL (get from PostgreSQL service → Connect)
   - `NODE_ENV=production`
   - `PORT=5000`

### **Step 4: Deploy Backend**

1. Click "Deploy Now"
2. Wait for build to complete
3. Note your backend URL (e.g., `https://clearpass-backend.up.railway.app`)

### **Step 5: Deploy Frontend to Vercel**

1. Go to https://vercel.com
2. Sign up with GitHub
3. Add your `clearpass` repo
4. Set VITE_API_BASE_URL to your Railway backend URL
5. Deploy

---

## 📋 Full Deployment Guide

See `DEMO_DEPLOYMENT_GUIDE.md` for detailed step-by-step instructions.

---

## 🎯 Success Metrics

You'll know it's working when:

- ✅ Railway backend URL returns `{"status":"ok"}` on `/health`
- ✅ Vercel frontend loads without errors
- ✅ You can register and login
- ✅ Dashboard shows compliance data

---

## 🆘 If You Need Help

1. Check Railway build logs
2. Check Vercel build logs
3. Verify environment variables
4. Test endpoints with curl
5. Review the full deployment guide

---

## ⏰ Timeline

- **Today (4-6 hours):** Complete core deployment
- **Tomorrow (3-4 hours):** Polish and custom domain
- **Day 3 (2-3 hours):** Final testing and demo prep

**Total:** ~10-13 hours spread over 3 days

---

**You're ready to start! Go to railway.app and begin Step 1.** 🚀
