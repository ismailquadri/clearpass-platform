# ClearPass Platform - Deployment Guide

This guide covers deploying the ClearPass Platform (backend API and frontend) to production.

## Prerequisites

- Node.js 18+
- PostgreSQL 16+
- Domain names for frontend and API
- SSL certificates (recommended)
- Cloud hosting account (Railway, Render, AWS, GCP, etc.)
- Paystack account for payments
- Postmark account for emails
- AWS S3 or Cloudflare R2 for file storage

## Architecture

- **Frontend**: React + TypeScript + Vite (port 5173/5174)
- **Backend**: Express + TypeScript + Knex.js (port 5000/5001)
- **Database**: PostgreSQL 16
- **Storage**: AWS S3 or Cloudflare R2
- **Payments**: Paystack
- **Email**: Postmark
- **Monitoring**: Sentry

## Backend Deployment

### 1. Prepare Environment Variables

Copy `.env.production` and update with your production values:

```bash
cd backend
cp .env.production .env
```

**Critical variables to update:**

- `DATABASE_URL`: Your production PostgreSQL connection string
- `JWT_SECRET` & `JWT_REFRESH_SECRET`: Generate strong random secrets
- `FRONTEND_URL`: Your production frontend URL
- `PAYSTACK_SECRET_KEY`: Your live Paystack secret key
- `S3_*`: Your AWS S3 or Cloudflare R2 credentials
- `POSTMARK_SERVER_TOKEN`: Your Postmark server token
- Government API keys (when available)

### 2. Deploy to Railway (Recommended)

Railway is the easiest option for Node.js deployments:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL database
railway add postgresql

# Add backend service
railway up

# Set environment variables in Railway dashboard
# railway variables set KEY=value

# Deploy
railway deploy
```

### 3. Deploy to Render

Alternatively, use Render:

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add all from `.env.production`
4. Add a **PostgreSQL** database
5. Deploy

### 4. Run Database Migrations

After deployment, run migrations:

```bash
# Via Railway CLI
railway run npm run migrate:latest

# Or via SSH into your server
ssh user@your-server
cd /path/to/backend
npm run migrate:latest
```

### 5. Verify Deployment

```bash
curl https://your-api-domain.com/health
```

## Frontend Deployment

### 1. Prepare Environment Variables

Copy `.env.production` and update with your production values:

```bash
cp .env.production .env.production.local
```

**Critical variables to update:**

- `VITE_API_BASE_URL`: Your production API URL
- `VITE_APP_URL`: Your production frontend URL
- `VITE_SENTRY_DSN`: Your Sentry DSN

### 2. Build for Production

```bash
npm run build
```

This creates an optimized `dist/` folder.

### 3. Deploy to Vercel (Recommended)

Vercel is ideal for React deployments:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

### 4. Deploy to Netlify

Alternatively, use Netlify:

1. Connect your GitHub repository to Netlify
2. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Environment variables**: Add all from `.env.production.local`
3. Deploy

### 5. Configure Custom Domain

Add your custom domain in the hosting provider dashboard and configure DNS:

```
A record: your-domain.com -> hosting provider IP
CNAME record: www -> your-domain.com
```

## Post-Deployment Configuration

### 1. Configure Paystack Webhooks

1. Log into your Paystack dashboard
2. Go to Settings → Webhooks
3. Add webhook URL: `https://your-api-domain.com/api/webhooks/paystack`
4. Copy the webhook secret to your backend `.env`

### 2. Configure Email Templates

Set up email templates in Postmark:

- Password reset
- MFA setup
- Expiry reminders
- Verification notifications

### 3. Set Up Monitoring

Configure Sentry for error tracking:

- Backend: Add Sentry DSN to backend `.env`
- Frontend: Already configured in `.env.production`

### 4. Configure SSL

Ensure SSL is enabled:

- Most hosting providers provide free SSL (Let's Encrypt)
- Configure HTTPS redirects

### 5. Set Up Backups

Configure automated database backups:

- Railway: Automatic backups included
- Render: Configure backup add-on
- Custom: Set up PostgreSQL WAL archiving

## Security Checklist

- [ ] Change all default secrets and passwords
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS to only allow your frontend domain
- [ ] Set up rate limiting (already configured in backend)
- [ ] Enable security headers (Helmet middleware)
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Enable audit logging (already configured)
- [ ] Review and update government API credentials
- [ ] Test payment webhooks in test mode before going live

## Scaling Considerations

### Backend Scaling

- **Horizontal scaling**: Deploy multiple instances behind a load balancer
- **Database**: Use managed PostgreSQL with read replicas
- **Caching**: Add Redis for session management and rate limiting
- **CDN**: Use CloudFront for API responses

### Frontend Scaling

- **CDN**: Vercel/Netlify provide global CDN
- **Asset optimization**: Already configured in Vite
- **Image optimization**: Use a CDN for images

## Monitoring and Maintenance

### Health Checks

Monitor these endpoints:

- `GET /health` - Backend health
- `GET /api/admin/health` - Detailed health (admin only)

### Logs

- **Backend**: Use Pino logger (configured)
- **Frontend**: Sentry for error tracking
- **Database**: Enable slow query logging

### Performance Monitoring

- **Backend**: Monitor response times, error rates
- **Frontend**: Web Vitals (LCP, FID, CLS)
- **Database**: Query performance, connection pool usage

## Troubleshooting

### Common Issues

**Database connection errors:**

- Verify `DATABASE_URL` is correct
- Check database is accessible from your deployment
- Ensure SSL certificates are valid

**CORS errors:**

- Verify `FRONTEND_URL` matches your frontend domain exactly
- Check browser console for specific CORS errors

**Payment webhook failures:**

- Verify Paystack webhook URL is accessible
- Check webhook secret matches
- Test with Paystack's webhook tester

**Email delivery issues:**

- Verify Postmark API token is valid
- Check email templates are configured
- Monitor Postmark delivery logs

## Rollback Procedure

If issues occur after deployment:

### Backend Rollback

```bash
# Via Railway
railway deployments revert

# Or manually deploy previous commit
railway deploy --commit <previous-commit-hash>
```

### Frontend Rollback

```bash
# Via Vercel
vercel rollback

# Or deploy previous commit
vercel --prod --commit <previous-commit-hash>
```

## Support

For deployment issues:

- Check logs: `railway logs` or hosting provider dashboard
- Review this guide's troubleshooting section
- Check Sentry for error reports
- Review database migration status

## Cost Estimates (Monthly)

**Backend (Railway):**

- Starter: $5/month
- Standard: $20/month (recommended for production)

**Database (Railway PostgreSQL):**

- Starter: $5/month
- Standard: $20/month (recommended for production)

**Frontend (Vercel):**

- Hobby: Free
- Pro: $20/month (recommended for production)

**Other services:**

- AWS S3: ~$5-10/month
- Postmark: ~$10-50/month (based on volume)
- Paystack: Transaction fees only
- Sentry: Free tier available

**Total estimated minimum**: ~$50-100/month for production
