import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty({
    description: 'The number of tickets to be purchased',
    example: 2,
  })
  @IsPositive({ message: 'The number of tickets must be a positive value' })
  ticketQuantity: number;

  @ApiProperty({
    description: 'The cost of each ticket',
    example: 50,
  })
  @IsPositive({ message: 'The ticket price must be greater than zero' })
  ticketPrice: number;

  @ApiProperty({
    description: 'Id of event',
    example: 'event123',
  })
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  ticketEventId: string;
}
