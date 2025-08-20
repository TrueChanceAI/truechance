# Environment Variables Template

## 🔒 SECURE (Server-Side Only) - NEVER expose these to the browser

```bash
VAPI_WEB_TOKEN=your_vapi_api_token_here
```

## ✅ SAFE to Expose (Client-Side) - These can be public

```bash
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_token_here
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_vapi_workflow_id_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Email (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
FROM_EMAIL=no-reply@truechance.app

# Auth
JWT_SECRET=your_jwt_secret_here
```

## 📝 Instructions:

1. **Create a `.env.local` file** in your project root
2. **Copy the variables above** into your `.env.local` file
3. **Replace placeholder values** with your actual values
4. **Make sure `VAPI_WEB_TOKEN` does NOT have `NEXT_PUBLIC_` prefix**
5. **All other variables are safe to expose** with `NEXT_PUBLIC_` prefix

## 🚨 Important Security Notes:

- **`VAPI_WEB_TOKEN`** should be your Vapi API token (server-side)
- **`NEXT_PUBLIC_VAPI_WEB_TOKEN`** should be your Vapi web token (client-side)
- **`NEXT_PUBLIC_VAPI_WORKFLOW_ID`** is just an identifier, safe to expose
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** is designed to be public
- **Never commit `.env.local`** to version control

## 🔍 Verification:

After setting up, restart your development server and check:

1. No more warnings about `NEXT_PUBLIC_` variables
2. Vapi calls work through your secure API endpoints
3. Sensitive tokens are not visible in browser dev tools

## 🔑 Token Types:

- **API Token**: Used server-side for workflow management
- **Web Token**: Used client-side for real-time voice calls
- **These are DIFFERENT tokens** - you need both from Vapi dashboard
