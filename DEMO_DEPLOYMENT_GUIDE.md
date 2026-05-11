# ClearPass Demo Deployment Guide
## 3-Day Professional Deployment Plan

This guide will walk you through deploying ClearPass for a professional demo in 3 days.

---

## 📋 **DAY 1: Core Deployment (4-6 hours)**

### **Step 1: Set up Railway Account (15 minutes)**
1. Go to [railway.app](https://railway.app)
2. Sign up using GitHub (recommended)
3. Verify your email
4. You'll get $5 free credit (enough for this demo)

### **Step 2: Create Railway Project (10 minutes)**
1. Click "New Project"
2. Click "Deploy from GitHub repo"
3. Authorize Railway to access your GitHub
4. Select the `clearpass` repository
5. Click "Deploy Now"

### **Step 3: Add PostgreSQL Database (10 minutes)**
1. In your Railway project, click "+ New Service"
2. Search for "PostgreSQL" and select it
3. Click "Add PostgreSQL"
4. Wait for it to provision (1-2 minutes)

### **Step 4: Configure Backend Service (20 minutes)**
1. Click on your backend service (should be auto-detected)
2. Go to "Settings" tab
3. Set the following:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Go to "Variables" tab
5. Add these environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=generate-a-long-random-secret-here-minimum-32-chars
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_SECRET=generate-another-long-random-secret-here
   JWT_REFRESH_EXPIRES_IN=30d
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
6. Click "Add Variable" for each one
7. For DATABASE_URL, click the PostgreSQL service → "Connect" → "Copy Connection String"
8. Paste it as DATABASE_URL variable

### **Step 5: Deploy Backend (15 minutes)**
1. Go to the "Deployments" tab
2. Click "Deploy Now" or "Redeploy"
3. Wait for the build to complete (3-5 minutes)
4. Check the logs for any errors
5. Once deployed, you'll get a URL like `https://clearpass-backend.up.railway.app`

### **Step 6: Run Database Migrations (10 minutes)**
1. In Railway, click on your backend service
2. Click "Console" tab
3. Click "New Console"
4. Select "Shell"
5. Run these commands:
   ```bash
   cd backend
   npx knex migrate:latest
   npx knex seed:run
   ```
6. Wait for migrations to complete

### **Step 7: Test Backend (10 minutes)**
1. Copy your Railway backend URL
2. Test health endpoint:
   ```bash
   curl https://your-backend-url.railway.app/health
   ```
3. Should return: `{"status":"ok","timestamp":"..."}`

### **Step 8: Deploy Frontend to Vercel (20 minutes)**
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "Add New Project"
4. Select the `clearpass` repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add environment variables:
   ```
   VITE_API_BASE_URL=https://your-backend-url.railway.app
   VITE_USE_MOCKS=false
   VITE_APP_ENV=production
   ```
7. Click "Deploy"
8. Wait for deployment (2-3 minutes)
9. You'll get a URL like `https://clearpass.vercel.app`

### **Step 9: Test Frontend-Backend Connection (10 minutes)**
1. Open your Vercel frontend URL
2. Try to register a new user
3. Try to login
4. Check if dashboard loads
5. If CORS errors, update FRONTEND_URL in Railway backend variables

---

## 📋 **DAY 2: Polish & Professional Setup (3-4 hours)**

### **Step 1: Set Up Custom Domain (1 hour)**
**For Frontend (Vercel):**
1. Buy a domain (Namecheap, GoDaddy, etc.) or use a subdomain
2. In Vercel, go to "Settings" → "Domains"
3. Add your domain (e.g., `demo.clearpass.com.ng`)
4. Update DNS records as instructed by Vercel
5. Wait for SSL certificate (5-10 minutes)

**For Backend (Railway):**
1. In Railway, go to backend service → "Settings" → "Networking"
2. Add custom domain
3. Update DNS records
4. Wait for SSL

### **Step 2: Remove Development Markers (30 minutes)**
1. Check frontend for any "Development Mode" text
2. Remove console.log statements in production build
3. Ensure error messages are user-friendly
4. Update any placeholder text

### **Step 3: Test All User Flows (1 hour)**
Test these scenarios:
1. New user registration
2. User login
3. Dashboard loading
4. Certificate upload
5. Compliance score calculation
6. Alerts display
7. Settings page
8. Logout

### **Step 4: Fix Any Issues (1 hour)**
- Document any bugs found
- Fix critical issues
- Note non-critical issues for later

---

## 📋 **DAY 3: Final Prep (2-3 hours)**

### **Step 1: Dress Rehearsal (1 hour)**
1. Go through the entire demo yourself
2. Test on different browsers (Chrome, Safari, Firefox)
3. Test on mobile if possible
4. Check for any slow loading pages
5. Prepare for questions about features

### **Step 2: Create Demo Script (30 minutes)**
Create a simple script:
```
1. Introduction (2 min)
2. Login Demo (3 min)
3. Dashboard Overview (5 min)
4. Certificate Management (5 min)
5. Compliance Scoring (5 min)
6. Alert System (3 min)
7. Q&A (10 min)
```

### **Step 3: Prepare Demo Account (30 minutes)**
1. Create a clean demo account
2. Pre-populate with good sample data
3. Ensure all certificates show "Active" status
4. Verify compliance score looks good

### **Step 4: Final Verification (30 minutes)**
1. Test the demo account
2. Verify all URLs work
3. Check SSL certificates
4. Test mobile responsiveness
5. Have backup screenshots ready

---

## 🔧 **Environment Variables Reference**

### **Backend (Railway)**
```
NODE_ENV=production
PORT=5000
DATABASE_URL=[from Railway PostgreSQL]
JWT_SECRET=[generate 32+ char random string]
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=[generate different 32+ char random string]
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=https://your-frontend-domain.com
LOG_LEVEL=error
```

### **Frontend (Vercel)**
```
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_USE_MOCKS=false
VITE_APP_ENV=production
VITE_APP_URL=https://your-frontend-domain.com
```

---

## 🚨 **Troubleshooting Common Issues**

### **CORS Errors**
- Update FRONTEND_URL in Railway to match your Vercel domain exactly
- Include protocol (https://) and no trailing slash

### **Database Connection Errors**
- Verify DATABASE_URL is correct
- Check PostgreSQL service is running
- Ensure migrations ran successfully

### **Build Failures**
- Check build logs in Railway/Vercel
- Ensure all dependencies are in package.json
- Verify TypeScript compiles without errors

### **Frontend Can't Reach Backend**
- Verify VITE_API_BASE_URL is correct
- Check backend is running and healthy
- Test backend health endpoint directly

---

## 📞 **If You Get Stuck**

1. Check Railway logs: Click service → "Deployments" → Click deployment → "Logs"
2. Check Vercel logs: Click project → "Deployments" → Click deployment → "Function Logs"
3. Test endpoints directly with curl
4. Check environment variables are set correctly
5. Verify database migrations ran

---

## ✅ **Success Criteria**

You'll know the deployment is successful when:
- [ ] Backend health endpoint returns 200
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard loads with data
- [ ] SSL certificates are valid (no browser warnings)
- [ ] Custom domain works (if set up)
- [ ] Mobile site looks acceptable

---

## 🎯 **Demo Day Checklist**

- [ ] Test demo account login
- [ ] Verify all sample data looks good
- [ ] Test on Chrome, Safari, and Firefox
- [ ] Test on mobile if possible
- [ ] Have backup screenshots ready
- [ ] Know your talking points
- [ ] Prepare answers to common questions
- [ ] Have internet connection backup (hotspot)
- [ ] Test screen sharing if remote demo
- [ ] Relax and be confident!

**Good luck! You've got this.**