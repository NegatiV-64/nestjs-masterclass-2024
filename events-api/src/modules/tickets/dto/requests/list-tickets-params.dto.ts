import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, Max } from 'class-validator';
import { TicketsSortBy, TicketsSortOrder } from 'src/modules/tickets/types/tickets-sort-params.type';

export class ListTicketsParamsReqDto {
  @Transform(({ value }) => (typeof value !== 'string' ? undefined : parseInt(value, 10)), { toClassOnly: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  page?: number;

  @Transform(({ value }) => (typeof value !== 'string' ? undefined : parseInt(value, 10)), { toClassOnly: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(1000)
  limit?: number;

  @IsOptional()
  @IsEnum(TicketsSortBy)
  @Expose({ name: 'sort_by' })
  sortBy?: TicketsSortBy;

  @IsOptional()
  @IsEnum(TicketsSortOrder)
  @Expose({ name: 'sort_order' })
  sortOrder?: TicketsSortOrder;
}
