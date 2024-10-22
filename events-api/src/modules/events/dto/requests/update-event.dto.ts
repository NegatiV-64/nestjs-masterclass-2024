import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { TimeFormat } from 'src/shared/constants/time.constant';
import { IsDateFormatValid } from 'src/shared/validators/date-format.validator';

export class UpdateEventReqDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  eventName: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  eventDescription: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  eventLocation: string;

  @IsString()
  @IsOptional()
  @IsDateFormatValid(TimeFormat.CalendarWithTime)
  eventDate: string;
}
