import { IsOptional, IsString, IsIn } from 'class-validator';

export class SortEventsDto {
  @IsOptional()
  @IsString()
  @IsIn(['eventName', 'date', 'location'])
  sort_by: string = 'eventName';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sort_order: string = 'asc';
}
