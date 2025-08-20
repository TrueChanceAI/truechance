# Authentication Setup

This application now uses custom API routes for authentication. Kinde has been removed.

## 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase (used for data storage)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 2. API Overview

Endpoints:

- POST `/api/auth/register` → Register user and send OTP
- POST `/api/auth/login` → Login, returns user and a session token (base64)
- POST `/api/auth/verify-otp` → Verify OTP (email)
- POST `/api/auth/logout` → Clear session (optional)

## 3. OAuth Providers (Optional)

To enable Google and GitHub OAuth:

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs from Kinde dashboard
6. Copy Client ID and Client Secret to Kinde dashboard

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL to Kinde's callback URL
4. Copy Client ID and Client Secret to Kinde dashboard

## 4. Features Implemented

✅ **Authentication Flow**

- Sign up with email/password
- Sign in with email/password
- Password reset (coming soon)

✅ **User Experience**

- Auth modal appears when clicking "Upload & Start" if not authenticated
- Automatic redirect to upload flow after successful authentication
- User menu with avatar/initials
- Profile and sign out options

✅ **Route Protection**

- Protected routes require authentication
- Middleware-level route protection
- SSR-friendly session access
- Automatic redirects for unauthenticated users

✅ **UI Components**

- Clean, minimal authentication modal
- User menu dropdown
- Loading states and error handling
- Responsive design

## 5. Usage

### Protected Routes

Wrap any component that requires authentication with the `ProtectedRoute` component:

```tsx
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content requires authentication</div>
    </ProtectedRoute>
  );
}
```

The Redux store (`me` slice) persists the authenticated user and `sessionToken`.

## 6. Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**

   - Check that your redirect URLs in Kinde dashboard match exactly
   - Ensure no trailing slashes or protocol mismatches

2. **OAuth not working**

   - Verify OAuth credentials are correctly set in Kinde dashboard
   - Check that redirect URIs are properly configured

3. **Authentication state not persisting**
   - Ensure cookies are enabled
   - Check browser console for errors

### Development vs Production

- **Development**: Use `http://localhost:3000` for all URLs
- **Production**: Update all URLs to your production domain
- **Environment**: Ensure `.env.local` is not committed to version control

## 7. Security Notes

- Never commit `.env.local` to version control
- Use HTTPS in production
- Regularly rotate OAuth client secrets
- Monitor authentication logs in Kinde dashboard
- Implement rate limiting for authentication endpoints if needed
