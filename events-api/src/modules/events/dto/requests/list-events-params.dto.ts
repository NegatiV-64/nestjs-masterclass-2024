import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString, Max } from 'class-validator';

export class ListEventsParamsReqDto {
  @Transform(
    (params) => {
      const { value } = params;
      return typeof value === 'string' ? parseInt(value, 10) : undefined;
    },
    { toClassOnly: true },
  )
  @IsOptional()
  @IsInt()
  @IsPositive()
  page?: number;

  @Transform(
    (params) => {
      const { value } = params;
      return typeof value === 'string' ? parseInt(value, 10) : undefined;
    },
    { toClassOnly: true },
  )
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(1000)
  limit?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  sort_by?: 'eventName' | 'eventDate' | 'eventCreatedAt' | 'eventUpdatedAt';

  @IsOptional()
  @IsString()
  sort_order?: 'asc' | 'desc';
}
