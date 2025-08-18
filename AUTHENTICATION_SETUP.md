# Authentication Setup with Kinde

This application uses Kinde for authentication. Follow these steps to set up authentication:

## 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Kinde Authentication
NEXT_PUBLIC_KINDE_CLIENT_ID=your_kinde_client_id
KINDE_CLIENT_SECRET=your_kinde_client_secret
NEXT_PUBLIC_KINDE_ISSUER_URL=https://your-domain.kinde.com
NEXT_PUBLIC_KINDE_LOGOUT_URL=http://localhost:3000
NEXT_PUBLIC_KINDE_REDIRECT_URL=http://localhost:3000

# Supabase (if still needed for other features)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 2. Kinde Dashboard Setup

1. Go to [Kinde Dashboard](https://kinde.com)
2. Create a new application
3. Configure the following settings:
   - **Allowed callback URLs**: `http://localhost:3000`
   - **Allowed logout redirect URLs**: `http://localhost:3000`
   - **Allowed origins**: `http://localhost:3000`
4. Copy the Client ID, Client Secret, and Issuer URL to your `.env.local` file

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
- OAuth with Google and GitHub
- Magic link authentication
- Password reset

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
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content requires authentication</div>
    </ProtectedRoute>
  );
}
```

### Authentication Hook
Use the `useAuth` hook to access authentication state and methods:

```tsx
import { useAuth } from '@/lib/contexts/AuthContext';

export default function MyComponent() {
  const { user, signOut, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {user ? (
        <div>Welcome, {user.email}</div>
      ) : (
        <div>Please sign in</div>
      )}
    </div>
  );
}
```

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
