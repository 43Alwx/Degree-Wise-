# Security Guide - CodePath

## 🔐 What's Protected

### ✅ Already Implemented
1. **Environment Variables**: `.env` protected, never committed to Git
2. **Rate Limiting**: 100 requests/min on GET, 50/min on POST
3. **Input Sanitization**: XSS protection via `lib/security.js`
4. **CORS**: Configured for localhost (dev) and your domain (prod)
5. **SQL Injection**: Prevented by Prisma ORM
6. **Error Handling**: Production errors hide sensitive details

### ⚠️ To Do Before Production
- [ ] Add authentication (NextAuth.js)
- [ ] Set environment variables in Vercel
- [ ] Configure production CORS domain

---

## 🚀 Quick Start - Secure Your APIs

### For New API Endpoints - Copy This:

```javascript
import { withSecurity, isValidUserId, secureLog, getSafeErrorResponse } from '../../../lib/security'
import { prisma } from '../../../lib/prisma'

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId } = req.query

    // Validate input
    if (!userId || !isValidUserId(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' })
    }

    // Your logic
    const data = await prisma.user.findUnique({ where: { id: userId } })

    res.status(200).json(data)
  } catch (error) {
    secureLog(error, { userId })
    res.status(500).json(getSafeErrorResponse(error, 'Failed to fetch data'))
  }
}

// Apply security middleware
export default withSecurity(handler)
```

**That's it!** This gives you:
- Rate limiting ✓
- Input sanitization ✓
- CORS ✓
- Secure error logging ✓

---

## 📋 Daily Checklist

### Before Committing
```bash
git status          # Verify .env not staged
npm audit          # Check vulnerabilities (currently 0!)
```

### Before Deploying
1. Set `.env` variables in Vercel dashboard
2. Update `NEXTAUTH_URL` to your production domain
3. Generate new `NEXTAUTH_SECRET`: `openssl rand -base64 32`

---

## 🔑 Environment Variables

**Local (`.env` file)**:
```env
DATABASE_URL="postgresql://postgres:PASSWORD@HOST:5432/postgres"
NEXTAUTH_SECRET="generate-with-openssl"
NEXTAUTH_URL="http://localhost:3002"
```

**Production (Vercel Dashboard)**:
Same variables, but use production database URL and domain.

**Never commit `.env`** - Already in `.gitignore` ✓

---

## 🛡️ Security Utils (`lib/security.js`)

```javascript
import { withSecurity, isValidUserId, sanitizeInput, secureLog } from '../lib/security'

// Validate user ID
isValidUserId('test-user-123')  // true

// Sanitize input (prevents XSS)
sanitizeInput('<script>alert(1)</script>')  // &lt;script&gt;...

// Secure logging (hides sensitive data)
secureLog(error, { userId, action: 'fetch' })

// Apply all security (use this!)
export default withSecurity(handler)
```

---

## 🚨 If Something Goes Wrong

1. **Rotate credentials immediately**:
   ```bash
   openssl rand -base64 32  # New secret
   ```
2. **Check logs** in Vercel dashboard
3. **Fix and redeploy**

---

## ✅ Security Audit Status

```bash
npm audit
# Result: found 0 vulnerabilities ✓

git check-ignore .env
# Result: .env is properly ignored ✓
```

**Last Checked**: October 2025

---

## 📚 Need More Info?

- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **Next.js Security**: https://nextjs.org/docs/advanced-features/security-headers
- **Prisma Security**: https://www.prisma.io/docs/guides/performance-and-optimization

---

**Keep it simple. Use `withSecurity()` on every API. You're protected.**
