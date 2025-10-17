import { z } from 'zod';

/** Env variables schema */
export const envSchema = z.object({
  DATABASE_URL: z.string(),
});

/** Type of validated env */
export type EnvSchema = z.infer<typeof envSchema>;
