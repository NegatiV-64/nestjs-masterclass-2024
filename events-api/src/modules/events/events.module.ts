import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";

@Module({
    controllers: [EventsController],
    providers: [EventsService],
    imports: [DatabaseModule]
})
export class EventsModule {}
