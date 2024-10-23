import { z } from 'zod';

const envConfigSchema = z.object({
  APP_ENV: z.enum(['development', 'production', 'test']),
  APP_PORT: z.coerce.number().int().positive(),
  AUTH_TOKEN_SECRET: z.string(),
  AUTH_TOKEN_EXPIRES_IN: z.string(),
  PAYMENT_API_ACCESS_TOKEN: z.string(),
  PAYMENT_API_URL: z.string(),
});

export type EnvConfig = z.infer<typeof envConfigSchema>;

export function validateEnv(config: unknown): EnvConfig {
  const parsedConfig = envConfigSchema.safeParse(config);

  if (!parsedConfig.success) {
    const errors = parsedConfig.error.errors.map((error) => {
      return {
        field: error.path.join('.'),
        message: error.message,
      };
    });

    throw new Error(`Config validation error: ${JSON.stringify(errors)}`);
  }

  return parsedConfig.data;
}
