import { Body, Controller, HttpStatus, Param, ParseUUIDPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthTokenGuard } from 'src/shared/guards/auth-token.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { PaymentDto } from './dto/payment.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('tickets')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @ApiOperation({ summary: 'Payment operation for ticket with ID' })
  @Post(':ticketId/pay')
  @UseGuards(AuthTokenGuard, RolesGuard)
  async payForTicket(
    @Param(
      'ticketId',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    )
    ticketId: string,
    @Body() paymentDto: PaymentDto,
    @Request() req,
  ) {
    const { userId } = req.user
    const paymentResult = await this.paymentsService.payForTicket(userId, ticketId, paymentDto)

    return paymentResult;
  }

  @ApiOperation({ summary: 'User can cancel a ticket' })
  @Put(':ticketId/cancel')
  @UseGuards(AuthTokenGuard, RolesGuard)
  async cancelTicket(
    @Param(
      'ticketId',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    )
    ticketId: string,
    @Request() req,
  ) {
    const { userId } = req.user;
    const canceledTicket = await this.paymentsService.cancelTicket(userId, ticketId);
    
    return canceledTicket;
  }
}
