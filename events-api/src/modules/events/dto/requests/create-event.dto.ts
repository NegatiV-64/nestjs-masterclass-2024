import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { TimeFormat } from 'src/shared/constants/time.constant';
import { IsDateFormatValid } from 'src/shared/validators/date-format.validator';

export class CreateEventReqDto {
  @ApiProperty({
    example: "Example Event Name"
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  eventName: string;

  @ApiProperty({
    example: "Example Event Description"
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  eventDescription: string;

  @ApiProperty({
    example: "Example Event Location"
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  eventLocation: string;

  @ApiProperty({
    example: "2024-10-07 11:00"
  })
  @IsString()
  @IsDateFormatValid(TimeFormat.CalendarWithTime)
  eventDate: string;
}
