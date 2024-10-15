import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty({
    description: 'The quantity of tickets being purchased',
    example: 2,
  })
  @IsPositive({ message: 'Ticket quantity must be greater than zero' })
  ticketQuantity: number;

  @ApiProperty({
    description: 'The price per ticket',
    example: 50,
  })
  @IsPositive({ message: 'Ticket quantity must be greater than zero' })
  ticketPrice: number;

  @ApiProperty({
    description: 'The ID of the event for which the ticket is being purchased',
    example: 'event123',
  })
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  ticketEventId: string;
}
