import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResult {
  user: AuthenticatedUser | null;
  error?: string;
  status: number;
}

/**
 * Extract user information from JWT token in Authorization header
 */
export async function authenticateUser(req: NextRequest): Promise<AuthResult> {
  try {
    // Get Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        user: null,
        error: "Missing or invalid authorization header",
        status: 401
      };
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // For Kinde tokens, we'll decode the JWT to get user info
    // Note: In production, you should verify the token signature with Kinde's public key
    try {
      // Simple JWT decode (header.payload.signature)
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format");
      }
      
             // Decode the payload (second part) - handle base64 padding issues
       let payloadStr: string;
       try {
         // First try normal decoding
         payloadStr = Buffer.from(parts[1], 'base64').toString();
       } catch (base64Error) {
         // If that fails, try with proper padding
         const padded = parts[1] + '='.repeat((4 - parts[1].length % 4) % 4);
         payloadStr = Buffer.from(padded, 'base64').toString();
       }
       
       const payload = JSON.parse(payloadStr);
      
      // Check if token is expired
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        return {
          user: null,
          error: "Token expired",
          status: 401
        };
      }
      
             // Debug: Log the entire payload to see what fields are available
       console.log("🔍 JWT Payload contents:", {
         allFields: Object.keys(payload),
         sub: payload.sub,
         kid: payload.kid,
         email: payload.email,
         em: payload.em,
         name: payload.name,
         given_name: payload.given_name,
         aud: payload.aud,
         azp: payload.azp,
         iss: payload.iss
       });

       // Return authenticated user from token payload
       return {
         user: {
           id: payload.sub || payload.kid || 'unknown',
           email: payload.email || payload.em || 'unknown',
           name: payload.name || payload.given_name || undefined
         },
         status: 200
       };
      
    } catch (jwtError) {
      console.error("JWT decode error:", jwtError);
      return {
        user: null,
        error: "Invalid token format",
        status: 401
      };
    }

  } catch (error) {
    console.error("Authentication error:", error);
    return {
      user: null,
      error: "Authentication failed",
      status: 500
    };
  }
}

/**
 * Middleware function to protect API routes
 */
export async function requireAuth(req: NextRequest): Promise<AuthResult> {
  const authResult = await authenticateUser(req);
  
  if (authResult.user) {
    return authResult;
  }
  
  return authResult;
}

/**
 * Middleware function to verify user owns the resource
 */
export function requireOwnership(userEmail: string, resourceEmail: string): boolean {
  // Normalize emails for comparison (trim whitespace, convert to lowercase)
  const normalizedUserEmail = userEmail?.trim().toLowerCase();
  const normalizedResourceEmail = resourceEmail?.trim().toLowerCase();
  
  console.log("🔍 Ownership check:", {
    userEmail: normalizedUserEmail,
    resourceEmail: normalizedResourceEmail,
    match: normalizedUserEmail === normalizedResourceEmail
  });
  
  return normalizedUserEmail === normalizedResourceEmail;
}

/**
 * Helper function to create unauthorized response
 */
export function createUnauthorizedResponse(message: string = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * Helper function to create forbidden response
 */
export function createForbiddenResponse(message: string = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}
