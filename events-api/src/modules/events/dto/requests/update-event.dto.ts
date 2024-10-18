import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { TimeFormat } from 'src/shared/constants/time.constant';
import { IsDateFormatValid } from 'src/shared/validators/date-format.validator';

export class UpdateEventReqDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  eventName?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  eventDescription?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  eventLocation?: string;

  @IsOptional()
  @IsString()
  @IsDateFormatValid(TimeFormat.CalendarWithTime)
  eventDate?: string;
}
