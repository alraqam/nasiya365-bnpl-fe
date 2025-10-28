import { z, ZodError } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url('Invalid API base URL'),
  NEXT_PUBLIC_ENV: z.enum(['development', 'staging', 'production']).optional().default('development')
})

type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
      NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV
    })
  } catch (error) {
    if (error instanceof ZodError) {
      const missingVars = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n')
      throw new Error(`Environment variable validation failed:\n${missingVars}`)
    }
    throw error
  }
}

const env = validateEnv()

export default {
  baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
  environment: env.NEXT_PUBLIC_ENV,
  isDevelopment: env.NEXT_PUBLIC_ENV === 'development',
  isProduction: env.NEXT_PUBLIC_ENV === 'production'
}
