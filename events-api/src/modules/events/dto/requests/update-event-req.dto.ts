import { IsOptional, IsString } from 'class-validator';
import { TimeFormat } from 'src/shared/constants/time.constant';
import { IsDateFormatValid } from 'src/shared/validators/date-format.validator';
export class UpdateEventReqDto {
  @IsOptional()
  @IsString()
  eventName?: string;

  @IsOptional()
  @IsString()
  eventDescription?: string;

  @IsOptional()
  @IsString()
  eventLocation?: string;

  @IsOptional()
  @IsDateFormatValid(TimeFormat.CalendarWithTime, { message: 'Event date must be in the format YYYY-MM-DD HH:mm' })
  eventDate?: string;
}
