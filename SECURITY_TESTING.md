# 🔒 API Security Testing Guide

This guide shows you how to manually test the security of your API routes.

## 🚀 Quick Start

### 1. Start Your Development Server
```bash
npm run dev
```

### 2. Run Automated Tests (Optional)
```bash
node security-test.js
```

## 🔐 Manual Security Tests

### **Test 1: Authentication Required**

#### **Expected Behavior**: All protected routes should return `401 Unauthorized` without a valid JWT token.

```bash
# Test save-files without auth
curl -X POST http://localhost:3000/api/save-files \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Expected: 401 Unauthorized
```

**Routes to Test**:
- `/api/save-files` → Should return 401
- `/api/save-interview` → Should return 401
- `/api/extract-resume` → Should return 401
- `/api/generate-questions` → Should return 401
- `/api/analyze-tone` → Should return 401
- `/api/interview-feedback` → Should return 401

### **Test 2: Rate Limiting**

#### **Expected Behavior**: Sending too many requests should trigger rate limiting (429 Too Many Requests).

```bash
# Send 35 requests rapidly (limit is 30 per 15 minutes)
for i in {1..35}; do
  echo "Request $i"
  curl -X POST http://localhost:3000/api/save-files \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer INVALID_TOKEN" \
    -d '{"email":"test@example.com"}' &
done

# Expected: Some requests should return 429
```

### **Test 3: Input Validation**

#### **Expected Behavior**: Malicious or invalid input should be rejected with 400 Bad Request.

#### **SQL Injection Test**:
```bash
curl -X POST http://localhost:3000/api/save-files \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer INVALID_TOKEN" \
  -d '{"email":"test@example.com; DROP TABLE interviews;"}'

# Expected: 400 Bad Request
```

#### **XSS Test**:
```bash
curl -X POST http://localhost:3000/api/save-files \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer INVALID_TOKEN" \
  -d '{"email":"<script>alert(\"xss\")</script>@example.com"}'

# Expected: 400 Bad Request
```

#### **Invalid Email Test**:
```bash
curl -X POST http://localhost:3000/api/save-files \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer INVALID_TOKEN" \
  -d '{"email":"not-an-email"}'

# Expected: 400 Bad Request
```

### **Test 4: File Upload Security**

#### **Expected Behavior**: Malicious file uploads should be rejected.

#### **Path Traversal Test**:
```bash
curl -X POST http://localhost:3000/api/save-files \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer INVALID_TOKEN" \
  -d '{"email":"test@example.com","resumeFileName":"../../../etc/passwd"}'

# Expected: 400 Bad Request
```

#### **Empty File Test**:
```bash
curl -X POST http://localhost:3000/api/save-files \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer INVALID_TOKEN" \
  -d '{"email":"test@example.com","resumeFile":""}'

# Expected: 400 Bad Request
```

### **Test 5: Authorization (Ownership)**

#### **Expected Behavior**: Users can only access their own data.

```bash
# This requires a valid token, so test in your app
# Try to save data for a different email than your authenticated user
# Expected: 403 Forbidden
```

### **Test 6: Security Headers**

#### **Expected Behavior**: Security headers should be present.

```bash
# Check response headers
curl -I http://localhost:3000/api/save-files

# Look for these headers:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## 🧪 Browser Developer Tools Testing

### **1. Network Tab Testing**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to access protected routes without authentication
4. Check response status codes

### **2. Console Testing**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Test API calls with invalid data
4. Look for validation errors

## 📊 Expected Test Results

| Test Category | Expected Result | Security Level |
|---------------|-----------------|----------------|
| Authentication | 401 Unauthorized | 🔒 High |
| Rate Limiting | 429 Too Many Requests | 🛡️ Medium |
| Input Validation | 400 Bad Request | 🛡️ Medium |
| File Security | 400 Bad Request | 🛡️ Medium |
| Authorization | 403 Forbidden | 🔒 High |
| Security Headers | Headers Present | 🛡️ Medium |

## 🚨 Security Checklist

- [ ] All API routes require authentication
- [ ] Rate limiting is enforced
- [ ] Input validation rejects malicious data
- [ ] File uploads are validated
- [ ] Users can only access their own data
- [ ] Security headers are present
- [ ] No sensitive data in error messages
- [ ] JWT tokens are properly validated

## 🔍 Advanced Testing

### **JWT Token Manipulation**
```bash
# Test with expired token
# Test with malformed token
# Test with token from different user
```

### **CORS Testing**
```bash
# Test from different origins
# Test with different HTTP methods
```

### **Content Security Policy**
```bash
# Check if CSP headers are present
# Test if inline scripts are blocked
```

## 📈 Security Score

After running all tests, calculate your security score:

```
Security Score = (Passed Tests / Total Tests) × 100

90-100%: Excellent Security 🔒
80-89%: Good Security 🛡️
70-79%: Moderate Security ⚠️
Below 70%: Needs Improvement ❌
```

## 🎯 Next Steps

1. **Run all manual tests** above
2. **Fix any failed tests**
3. **Run automated tests** with `node security-test.js`
4. **Document any security issues** found
5. **Implement additional security measures** if needed

## 🆘 Need Help?

If you find security issues:
1. Check the validation functions in `lib/validation.ts`
2. Review the authentication middleware in `lib/auth-middleware.ts`
3. Check the rate limiting implementation
4. Verify your environment variables are secure

---

**Remember**: Security is an ongoing process. Regularly test your APIs and stay updated with security best practices! 🔒✨
