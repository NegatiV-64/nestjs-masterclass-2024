import { IsOptional, IsString, IsDateString } from 'class-validator';

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
  @IsDateString()
  eventDate?: string;
}
