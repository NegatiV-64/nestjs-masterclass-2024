import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { validator } from "hono/validator";
import { EnvConfig, validateEnv } from "./configs/env.config";
import { z } from "zod";
import { randomUUID } from "crypto";
import { poweredBy } from "hono/powered-by";
import { cors } from "hono/cors";

validateEnv(process.env);

const app = new Hono();
app.use(poweredBy());
app.use(
    cors({
        origin: "*",
        allowMethods: ["POST"]
    })
);

app.post(
    "/payment",
    bearerAuth({
        token: EnvConfig.AccessToken
    }),
    validator("json", (value, context) => {
        const schema = z.object({
            last4: z.string().length(4),
            expiration: z.string().regex(/^\d{2}\/\d{2}$/),
            cardholder: z.string(),
            amount: z.number().positive(),
            paymentToken: z.string().length(22)
        });

        const result = schema.safeParse(value);
        if (!result.success) {
            return context.json({
                message: "Validation failed",
                errors: result.error.errors.map(
                    (error) => ({
                        field: error.path.join("."),
                        message: error.message
                    }),
                    400
                )
            });
        }

        return result.data;
    }),
    async (context) => {
        const requestBody = context.req.valid("json");
        const { last4 } = requestBody;

        if (last4 === "4242") {
            return context.json(
                {
                    message: "Payment successful",
                    transactionId: randomUUID()
                },
                200
            );
        }

        return context.json(
            {
                message: "Payment failed",
                transactionId: randomUUID(),
                error: {
                    code: "1001",
                    message: "Bank declined payment"
                }
            },
            400
        );
    }
);

serve(
    {
        port: parseInt(EnvConfig.AppPort, 10),
        fetch: app.fetch
    },
    () => {
        console.log(
            `Server running on port http://localhost:${EnvConfig.AppPort}`
        );
    }
);
