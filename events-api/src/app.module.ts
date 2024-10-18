import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validateEnv } from "./shared/configs/env.config";
import { DatabaseModule } from "./modules/database/database.module";
import { EventsModule } from "./modules/events/events.module";
import { AuthModule } from "./modules/auth/auth.module";
import { LoggerMiddleware } from "./shared/middleware";
import { TicketsModule } from "./modules/tickets/tickets.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
            validate: validateEnv
        }),
        DatabaseModule,
        AuthModule,
        EventsModule,
        TicketsModule
    ]
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes("*");
    }
}
