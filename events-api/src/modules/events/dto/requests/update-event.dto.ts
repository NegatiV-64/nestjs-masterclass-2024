import { CreateEventReqDto } from "./create-event.dto";
import { PartialType } from "@nestjs/swagger"

export class UpdateEventDto extends PartialType(CreateEventReqDto) { }