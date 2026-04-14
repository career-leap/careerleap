# CareerLeap Render Deployment Guide

This guide walks you through deploying CareerLeap on Render.com with a production-ready configuration.

## 📋 Prerequisites

- A [Render](https://render.com) account (free to sign up)
- Your code pushed to a GitHub/GitLab repository
- (Optional) AWS account for S3 file storage

---

## 🚀 Quick Deploy (Using Blueprint)

The easiest way to deploy is using the `render.yaml` blueprint.

### Step 1: Push Code to GitHub

Ensure all your changes are committed and pushed:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create Blueprint on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` and create:
   - PostgreSQL database
   - Django backend web service
   - React frontend static site

5. Click **"Apply"** to deploy all services

### Step 3: Wait for Deployment

- Database: Creates automatically (~2 minutes)
- Backend: Builds and deploys (~5 minutes)
- Frontend: Builds and deploys (~3 minutes)

### Step 4: Verify Deployment

1. **Backend health check**: Visit `https://careerleap-backend.onrender.com/api/auth/login/`
   - Should return `{"detail":"Method not allowed"}` (means Django is running)

2. **Frontend**: Visit `https://careerleap-frontend.onrender.com`
   - Should load the React app

3. **Test registration**: Create a test account to verify database connection

---

## ⚙️ Post-Deployment Configuration

### Create a Superuser (Admin Access)

Option 1: Using Render Dashboard
1. Go to your backend service → **"Shell"** tab
2. Run: `python manage.py createsuperuser`

Option 2: Using environment variables (auto-create on deploy)
```bash
# In Render dashboard, add to backend service Environment:
DJANGO_SUPERUSER_EMAIL=admin@yourdomain.com
DJANGO_SUPERUSER_PASSWORD=your-secure-password
```
Then redeploy the service.

### Access Django Admin

Visit: `https://careerleap-backend.onrender.com/admin/`

---

## 💰 Cost Breakdown

### Minimum Viable (Start Here)
| Service | Plan | Monthly Cost |
|---------|------|--------------|
| PostgreSQL | Starter | **$7** |
| Backend | Starter | **$7** |
| Frontend | Static (Free) | **$0** |
| **Total** | | **$14/month** |

### Production Scale
| Service | Plan | Monthly Cost |
|---------|------|--------------|
| PostgreSQL | Pro (4GB RAM) | **$25** |
| Backend | Starter | **$7** |
| Frontend | Static (Free) | **$0** |
| AWS S3 | ~10GB storage | **~$0.50** |
| **Total** | | **~$32.50/month** |

### High Traffic
| Service | Plan | Monthly Cost |
|---------|------|--------------|
| PostgreSQL | Pro + Read Replica | **$50** |
| Backend | Standard (2X resources) | **$25** |
| Frontend | Static (Free) | **$0** |
| AWS S3 | ~50GB storage | **~$2** |
| Redis | Starter (cache/sessions) | **$7** |
| **Total** | | **~$84/month** |

---

## 🔧 Optional: AWS S3 for File Storage

**Important**: Without S3, uploaded files will be lost when the service restarts (Render's filesystem is ephemeral).

### Setup S3 (Recommended for Production)

1. **Create S3 Bucket**:
   - Go to AWS Console → S3 → Create bucket
   - Name: `careerleap-media-prod`
   - Region: `us-east-1` (or your preferred region)
   - Block all public access: **Yes**

2. **Create IAM User**:
   - Go to IAM → Users → Create user
   - Name: `careerleap-render`
   - Attach policy: `AmazonS3FullAccess` (or create custom policy for just this bucket)

3. **Get Credentials**:
   - Create access key → Copy **Access Key ID** and **Secret Access Key**

4. **Add to Render Environment Variables**:
   ```
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_ACCESS_KEY=xxxxxxxx...
   AWS_STORAGE_BUCKET_NAME=careerleap-media-prod
   AWS_S3_REGION_NAME=us-east-1
   ```

5. **Redeploy** the backend service

---

## 🛠️ Manual Deploy (Without Blueprint)

If you prefer to create services manually:

### 1. Create PostgreSQL Database

1. Render Dashboard → **"New +"** → **"PostgreSQL"**
2. Name: `careerleap-db`
3. Plan: Starter ($7/month)
4. Click **"Create Database"**

### 2. Create Backend Web Service

1. Render Dashboard → **"New +"** → **"Web Service"**
2. Connect your repository
3. Configure:
   - **Name**: `careerleap-backend`
   - **Runtime**: Python 3
   - **Build Command**: `./backend_django/build.sh`
   - **Start Command**: `cd backend_django && gunicorn backend_django.wsgi:application --bind 0.0.0.0:$PORT --workers 2`
4. Add Environment Variables:
   - `DATABASE_URL`: (from the PostgreSQL service, click "Connect" to copy)
   - `SECRET_KEY`: (generate a secure random string)
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: `careerleap-backend.onrender.com`
   - `CORS_ALLOWED_ORIGINS`: `https://careerleap-frontend.onrender.com`
   - `FRONTEND_URL`: `https://careerleap-frontend.onrender.com`
5. Click **"Create Web Service"**

### 3. Create Frontend Static Site

1. Render Dashboard → **"New +"** → **"Static Site"**
2. Connect your repository
3. Configure:
   - **Name**: `careerleap-frontend`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL`: `https://careerleap-backend.onrender.com/api`
5. Add Redirects/Rewrites:
   - Source: `/api/*` → Destination: `https://careerleap-backend.onrender.com/api/*`
   - Source: `/*` → Destination: `/index.html`
6. Click **"Create Static Site"**

---

## 🔒 Security Checklist

Before going live, verify:

- [x] XSS vulnerabilities fixed (dangerous MIME types removed)
- [x] File metadata enumeration fixed (only own/public files visible)
- [x] Session price manipulation fixed (computed server-side)
- [x] Payment status manipulation fixed (removed from update serializer)
- [x] JWT token blacklist enabled
- [x] `DEBUG=False` in production
- [x] `SECRET_KEY` is secure and unique
- [x] CORS configured properly
- [x] HTTPS enforced

---

## 🐛 Troubleshooting

### "ModuleNotFoundError" on Build

**Cause**: Missing dependencies in requirements.txt

**Fix**: 
```bash
# Ensure all imports are in requirements.txt
pip freeze > backend_django/requirements.txt
git add backend_django/requirements.txt
git commit -m "Update requirements"
git push
```

### Database Connection Failed

**Cause**: DATABASE_URL not set correctly

**Fix**:
1. Go to your PostgreSQL service → "Connect"
2. Copy the "Internal Database URL"
3. Paste into backend service Environment as `DATABASE_URL`

### CORS Errors in Browser

**Cause**: CORS_ALLOWED_ORIGINS doesn't match frontend URL

**Fix**: Update `CORS_ALLOWED_ORIGINS` in backend environment to exactly match your frontend URL (including `https://`)

### Static Files Not Loading (404)

**Cause**: Whitenoise not configured or static files not collected

**Fix**: Verify in `settings.py`:
```python
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

### Uploaded Files Disappear

**Cause**: Render's filesystem is ephemeral

**Fix**: Configure AWS S3 (see section above)

### "Forbidden" on File Download

**Cause**: File permissions changed

**Fix**: Check that `is_public=True` or user is the file owner

---

## 📚 Useful Render Commands

Via Render Dashboard Shell:

```bash
# Run migrations manually
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Check database connection
python -c "from django.db import connection; cursor = connection.cursor(); print('DB connected!')"

# View logs
tail -f /var/log/render/*.log
```

---

## 🔄 Updating Your Deployment

Simply push changes to GitHub - Render will automatically rebuild and deploy:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Monitor the deployment in Render Dashboard.

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Django on Render**: https://render.com/docs/deploy-django
- **Troubleshooting**: Check service logs in Render Dashboard → Service → Logs

---

## ✨ Custom Domain (Optional)

1. Buy a domain (e.g., Namecheap, Cloudflare, GoDaddy)
2. In Render Dashboard:
   - Frontend service → Settings → Custom Domain
   - Backend service → Settings → Custom Domain
3. Add DNS records as instructed by Render
4. SSL certificates are automatically managed

---

**Happy deploying! 🚀**
