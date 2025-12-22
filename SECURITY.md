# Security Policy

## 🔒 Supported Versions

This project is currently in version 1.0.0. Security updates will be provided for:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅ Yes             |
| < 1.0   | ❌ No              |

## 🐛 Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 1. **Do Not** Open a Public Issue

Please **do not** open a public GitHub issue for security vulnerabilities.

### 2. Report Privately

Send a detailed report to:

- **Email**: [Create a private security advisory on GitHub]
- **GitHub**: Use the "Security" tab → "Report a vulnerability" feature

### 3. Include in Your Report

- **Description**: Clear description of the vulnerability
- **Impact**: What could an attacker do?
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Affected Versions**: Which versions are affected
- **Proposed Fix**: If you have a suggested fix

### 4. Expected Response Time

- **Initial Response**: Within 48 hours
- **Status Update**: Within 5 business days
- **Fix Timeline**: Varies based on severity

## 🔐 Security Best Practices

### For Developers

1. **Never commit secrets** - Use environment variables for sensitive data
2. **Update dependencies** - Run `npm audit` and `pip list --outdated` regularly
3. **Review pull requests** - Check for security issues before merging
4. **Use HTTPS** - Always use HTTPS for API calls
5. **Validate input** - All user input is validated on both frontend and backend

### For Deployment

1. **Environment Variables**
   - Change `SECRET_KEY` in production
   - Use strong JWT secret keys
   - Never use default passwords

2. **Database Security**
   - Use PostgreSQL in production (not SQLite)
   - Enable SSL/TLS for database connections
   - Regular backups

3. **HTTPS/TLS**
   - Always use HTTPS in production
   - Use valid SSL certificates
   - Configure HSTS headers

4. **CORS Configuration**
   - Restrict CORS to specific domains
   - Don't use `allow_origins=["*"]` in production

5. **Rate Limiting**
   - Implement API rate limiting
   - Add DDoS protection
   - Monitor for suspicious activity

## 🛡️ Known Security Considerations

### Current Implementation (Development/Demo)

This project was built as a trial assignment with the following considerations:

1. **SQLite Database** - Use PostgreSQL for production
2. **CORS Open** - Restrict to specific domains in production
3. **No Rate Limiting** - Add rate limiting for production
4. **Simple JWT** - Consider adding refresh tokens
5. **No Email Verification** - Add email confirmation for production

### Recommended Production Hardening

```python
# backend/app/main.py - Production CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specific domain only
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH"],
    allow_headers=["Authorization", "Content-Type"],
)
```

```python
# Add rate limiting
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/questions")
@limiter.limit("5/minute")  # 5 questions per minute
async def create_question(...):
    ...
```

## 🔑 Environment Variables

Required secure environment variables:

```bash
# Backend (.env)
SECRET_KEY=<generate-strong-random-key>  # Use: openssl rand -hex 32
DATABASE_URL=<postgresql-connection-string>
WEBHOOK_URL=<external-webhook-endpoint>
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=60
```

## 📋 Security Checklist for Production

- [ ] Change all default secrets and keys
- [ ] Enable HTTPS with valid certificates
- [ ] Configure production database (PostgreSQL)
- [ ] Restrict CORS to specific domains
- [ ] Implement rate limiting
- [ ] Add input sanitization
- [ ] Enable security headers (HSTS, CSP, etc.)
- [ ] Set up logging and monitoring
- [ ] Regular dependency updates
- [ ] Backup strategy in place
- [ ] Incident response plan documented

## 🔍 Audit Trail

| Date | Version | Security Update |
|------|---------|----------------|
| 2025-12-22 | 1.0.0 | Initial security policy established |

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

## 📧 Contact

For security concerns, please use GitHub's private security reporting feature or contact the maintainer directly.

**Note**: This is a trial project. For production deployment, implement all recommended security hardening measures.
