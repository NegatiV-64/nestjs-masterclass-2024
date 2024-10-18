import { PartialType } from "@nestjs/mapped-types";
import { CreateEventReqDto } from "./create-event.dto";

export class UpdateEventReqDto extends PartialType(CreateEventReqDto) {}
