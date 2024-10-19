import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDetailsDto } from './dto/response/payment-details.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async pay(@Body() paymentDetails: PaymentDetailsDto) {
    return await this.paymentService.pay(paymentDetails);
  }
}
