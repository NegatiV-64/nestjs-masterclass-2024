import { IsIn, IsInt, IsOptional, IsPositive, IsString, Max } from 'class-validator';
import { ParseIntDecorator } from 'src/shared/decorators/parse-int.decorator';
export class ListEventsParamsReqDto {
  @ParseIntDecorator()
  @IsOptional()
  @IsInt()
  @IsPositive()
  page?: number;

  @ParseIntDecorator()
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
  @IsIn(['eventName', 'eventDate', 'eventCreatedAt', 'eventUpdatedAt'])
  sort_by?: 'eventName' | 'eventDate' | 'eventCreatedAt' | 'eventUpdatedAt';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sort_order?: 'asc' | 'desc';
}
