import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [PaymentService],
  imports: [HttpModule],
  exports: [PaymentService]
})
export class PaymentModule {}
