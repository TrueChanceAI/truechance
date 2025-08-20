export interface User {
  id: string;
  email: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Deprecated AuthContextType (Kinde removed)

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode: "signin" | "signup";
  onModeChange?: (mode: "signin" | "signup") => void;
}

export interface UserRegistration {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  otp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppUser {
  id: string;
  email: string;
  phone_number?: string;
  first_name: string;
  last_name: string;
  password_hash: string;
  otp?: string;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  user: UserProfile;
}

export interface AuthError {
  error: string;
}
