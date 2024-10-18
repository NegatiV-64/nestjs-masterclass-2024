import { PartialType } from '@nestjs/swagger';
import { CreateEventReqDto } from './create-event.dto';

export class UpdateEventReqDto extends PartialType(CreateEventReqDto) {}
