# CareerLeap Security Guide

This document outlines the security measures implemented in CareerLeap and provides guidance for secure deployment.

## Security Features Implemented

### 1. Authentication & Authorization

- **JWT Token Authentication** with short-lived access tokens (15 minutes default)
- **Rate Limiting** on all authentication endpoints:
  - Login: 10 attempts per minute per IP
  - Registration: 5 attempts per hour per IP
  - Password reset: 3 attempts per hour per IP
- **Strong Password Policy** requiring:
  - Minimum 10 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one digit
  - At least one special character
- **Password Reset Tokens** with:
  - 30-minute expiration
  - Hashed storage in cache
  - Rate limiting per email

### 2. File Upload Security

- **MIME Type Validation** using python-magic for accurate file type detection
- **Extension Blacklisting** of dangerous file types (.exe, .bat, .sh, .php, etc.)
- **File Size Limit** of 50MB per file
- **User-Scoped Storage** with UUID-based filenames
- **Automatic File Cleanup** when records are deleted

### 3. CORS & CSRF Protection

- **Strict CORS Policy** - only configured origins allowed
- **CSRF Protection** enabled for session-based authentication
- **SameSite Cookie Policy** set to 'Lax'

### 4. Security Headers

The following security headers are added to all responses:

- `Content-Security-Policy`: Restricts resource loading
- `X-Content-Type-Options: nosniff`: Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block`: XSS filter enabled
- `X-Frame-Options: DENY`: Prevents clickjacking
- `Referrer-Policy: strict-origin-when-cross-origin`: Controls referrer info
- `Permissions-Policy`: Restricts browser features

### 5. HTTPS/SSL (Production)

For production deployment, enable the following in your `.env`:

```bash
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SECURE_HSTS_PRELOAD=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
JWT_COOKIE_SECURE=True
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key (min 50 chars) | Generate with `python -c "import secrets; print(secrets.token_urlsafe(50))"` |
| `DEBUG` | Debug mode (False in production) | `False` |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts | `api.careerleap.com,www.careerleap.com` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins | `https://careerleap.com,https://www.careerleap.com` |

### Security-Related Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_ACCESS_TOKEN_LIFETIME_MINUTES` | JWT access token lifetime | 15 |
| `JWT_REFRESH_TOKEN_LIFETIME_DAYS` | JWT refresh token lifetime | 7 |
| `SECURE_SSL_REDIRECT` | Redirect HTTP to HTTPS | False |
| `SECURE_HSTS_SECONDS` | HSTS max age | 0 |
| `SESSION_COOKIE_SECURE` | Secure session cookie | False |
| `CSRF_COOKIE_SECURE` | Secure CSRF cookie | False |

## Production Deployment Checklist

- [ ] Generate a strong `SECRET_KEY`
- [ ] Set `DEBUG=False`
- [ ] Configure `ALLOWED_HOSTS` with your domain(s)
- [ ] Configure `CORS_ALLOWED_ORIGINS` with your frontend URL(s)
- [ ] Enable HTTPS and set `SECURE_SSL_REDIRECT=True`
- [ ] Enable HSTS with `SECURE_HSTS_SECONDS=31536000`
- [ ] Set `SESSION_COOKIE_SECURE=True` and `CSRF_COOKIE_SECURE=True`
- [ ] Use a production-grade database (PostgreSQL)
- [ ] Configure proper email backend (not console)
- [ ] Set up log aggregation and monitoring
- [ ] Enable Django admin with strong credentials
- [ ] Regularly update dependencies
- [ ] Set up automated security scanning

## Security Reporting

If you discover a security vulnerability, please report it privately rather than opening a public issue.

## Additional Resources

- [Django Security Documentation](https://docs.djangoproject.com/en/4.2/topics/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
