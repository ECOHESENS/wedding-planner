import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  
  // NextAuth
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  
  // Node environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  
  // File uploads
  UPLOAD_DIR: z.string().default('./public/uploads'),
  
  // Optional: External services
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  
  // Optional: Analytics
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  
  // Optional: Error tracking
  SENTRY_DSN: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:')
      error.errors.forEach(err => {
        console.error(`  ${err.path.join('.')}: ${err.message}`)
      })
      process.exit(1)
    }
    throw error
  }
}

export const env = validateEnv()

// Runtime validation for critical secrets
export function validateCriticalSecrets() {
  const warnings: string[] = []
  
  if (env.NODE_ENV === 'production') {
    // Production-specific validations
    if (!env.NEXTAUTH_SECRET || env.NEXTAUTH_SECRET.length < 64) {
      warnings.push('NEXTAUTH_SECRET should be at least 64 characters in production')
    }
    
    if (env.NEXTAUTH_URL.includes('localhost')) {
      warnings.push('NEXTAUTH_URL should not use localhost in production')
    }
    
    if (!env.DATABASE_URL.includes('ssl=true') && !env.DATABASE_URL.includes('sslmode=require')) {
      warnings.push('DATABASE_URL should use SSL in production')
    }
  }
  
  // Development warnings
  if (env.NODE_ENV === 'development') {
    if (env.NEXTAUTH_SECRET === 'your-super-secret-key-for-development') {
      warnings.push('Please change the default NEXTAUTH_SECRET in development')
    }
  }
  
  return warnings
}

// Security headers configuration
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
}