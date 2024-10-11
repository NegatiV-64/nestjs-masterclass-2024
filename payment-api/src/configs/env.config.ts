import { z } from "zod";

const envConfigSchema = z.object({
  APP_PORT: z.coerce.number().int().positive(),
  ACCESS_TOKEN: z.string(),
});

export const EnvConfig = {
  AccessToken: process.env.ACCESS_TOKEN as string,
  AppPort: process.env.APP_PORT as string,
};

export function validateEnv(config: unknown) {
  const parsedConfig = envConfigSchema.safeParse(config);

  if (!parsedConfig.success) {
    const errors = parsedConfig.error.errors.map((error) => {
      return {
        field: error.path.join("."),
        message: error.message,
      };
    });

    throw new Error(`Config validation error: ${JSON.stringify(errors)}`);
  }
}
