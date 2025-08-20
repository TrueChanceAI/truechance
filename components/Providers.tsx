"use client";

import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { TranslationProvider } from "@/lib/contexts/TranslationContext";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <KindeProvider
      clientId={process.env.KINDE_CLIENT_ID!}
      clientSecret={process.env.KINDE_CLIENT_SECRET!}
      issuerUrl={process.env.KINDE_ISSUER_URL!}
      logoutUrl={process.env.KINDE_POST_LOGOUT_REDIRECT_URL!}
      redirectUrl={process.env.KINDE_POST_LOGIN_REDIRECT_URL!}
    >
      <TranslationProvider>
        <AuthProvider>{children}</AuthProvider>
      </TranslationProvider>
    </KindeProvider>
  );
}
