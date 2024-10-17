import { IsString, MaxLength, MinLength } from 'class-validator';
import { TimeFormat } from 'src/shared/constants/time.constant';
import { IsDateFormatValid } from 'src/shared/validators/date-format.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventReqDto {
  @ApiProperty({
    description: 'The name of the event',
    example: 'Tech Conference 2024',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  eventName: string;

  @ApiProperty({
    description: 'A description of the event',
    example: 'A conference for discussing the latest in technology trends and innovations.',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  eventDescription: string;

  @ApiProperty({
    description: 'The location where the event will take place',
    example: 'Silicon Valley, California',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  eventLocation: string;

  @ApiProperty({
    description: 'The date and time of the event in the format YYYY-MM-DD HH:mm:ss',
    example: '2024-12-01 10:30:00',
  })
  @IsString()
  @IsDateFormatValid(TimeFormat.CalendarWithTime)
  eventDate: string;
}
