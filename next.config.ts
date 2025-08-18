import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "ik.imagekit.io",
  //       port: "",
  //     },
  //   ],
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Security headers
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // More permissive CSP for development to avoid blocking video/audio functionality
    // Development CSP allows more sources to prevent blocking of WebRTC, WebSockets, etc.
    const cspValue = isDevelopment 
      ? "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:; style-src 'self' 'unsafe-inline' blob:; img-src 'self' data: https: blob:; font-src 'self' data: blob:; connect-src 'self' https: wss: ws: blob: data:; media-src 'self' blob: data:; worker-src 'self' blob:; child-src 'self' blob:; frame-src 'self' blob:; frame-ancestors 'none';"
      : "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:; style-src 'self' 'unsafe-inline' blob:; img-src 'self' data: https: blob:; font-src 'self' data: blob:; connect-src 'self' https: wss: ws: blob: data:; media-src 'self' blob: data:; worker-src 'self' blob:; child-src 'self' blob:; frame-src 'self' blob:; frame-ancestors 'none';";
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'Content-Security-Policy',
            value: cspValue
          }
        ]
      }
    ];
  }
};

export default nextConfig;
