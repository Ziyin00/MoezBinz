# Deployment Guide - Frontend & Backend Connection

## Issues Fixed

### 1. Frontend API Configuration

- ✅ Updated `client/src/api/axios.ts` with dynamic API URL detection
- ✅ Added automatic localhost detection for development
- ✅ Added debug logging to help identify connection issues

### 2. Backend CORS Configuration

- ✅ Updated `server/server.js` with proper CORS configuration
- ✅ Added multiple allowed origins for different deployment scenarios
- ✅ Added health check endpoint at `/api/health`

## Deployment Steps

### Frontend (Vercel/Netlify)

1. **Set Environment Variable:**

   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

2. **Update API URL in axios.ts:**
   - Change line 18 in `client/src/api/axios.ts` to your actual backend URL
   - Example: `return 'https://moezbinz.onrender.com/api';`

### Backend (Render/Heroku)

1. **Set Environment Variables:**

   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=3001
   NODE_ENV=production
   ```

2. **Update CORS Origins:**
   - Update the `allowedOrigins` array in `server/server.js` with your frontend URL
   - Example: `'https://your-frontend-url.vercel.app'`

## Testing Connection

### 1. Test Backend Health

```bash
curl https://your-backend-url.com/api/health
```

Should return:

```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### 2. Test Frontend Connection

1. Open browser console on your deployed frontend
2. Look for these logs:
   ```
   🌐 API Base URL: https://your-backend-url.com/api
   🌐 Current hostname: your-frontend-domain.com
   ```

### 3. Test API Endpoints

Try logging in or making any API call and check for:

- Network errors in browser dev tools
- CORS errors in console
- 401/403 errors (authentication issues)

## Common Issues & Solutions

### Issue: CORS Error

**Solution:** Update the `allowedOrigins` array in `server/server.js` with your exact frontend URL

### Issue: 404 Not Found

**Solution:** Check that your backend URL is correct and includes `/api` at the end

### Issue: 401 Unauthorized

**Solution:** Check that authentication endpoints are working and tokens are being sent

### Issue: Connection Refused

**Solution:** Verify your backend is deployed and running, check the health endpoint

## Environment Variables Needed

### Frontend (.env)

```
VITE_API_URL=https://your-backend-url.com/api
```

### Backend (.env)

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=3001
NODE_ENV=production
ACCESS_TOKEN_SECRET=your_jwt_secret
ACCESS_TOKEN_EXPIRES=1h
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=https://your-frontend-url.com
```

## Debug Commands

### Check Backend Status

```bash
curl -X GET https://your-backend-url.com/api/health
```

### Test Authentication

```bash
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@moezbinz.com","password":"admin123"}'
```

### Check CORS

```bash
curl -X OPTIONS https://your-backend-url.com/api/auth/login \
  -H "Origin: https://your-frontend-url.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"
```
