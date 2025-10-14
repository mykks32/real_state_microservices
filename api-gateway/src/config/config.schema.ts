import { z } from 'zod';

/** Env variables schema */
export const envSchema = z.object({
  PORT: z.string(),
  AUTH_SERVICE_URL: z.string(),
  ENQUIRY_SERVICE_URL: z.string(),
  PROPERTY_SERVICE_URL: z.string(),
});

/** Type of validated env */
export type EnvSchema = z.infer<typeof envSchema>;
