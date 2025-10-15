import { z } from 'zod';

/** Env variables schema */
export const envSchema = z.object({
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.string().default('5432'),
  DATABASE_USER: z.string(),
  DATABASE_PASS: z.string(),
  DATABASE_NAME: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_PASSWORD: z.string(),
});

/** Type of validated env */
export type EnvSchema = z.infer<typeof envSchema>;
