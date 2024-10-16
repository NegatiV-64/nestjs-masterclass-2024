import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Module({
  providers: [PaymentsService],
  imports: [HttpModule],
  exports: [PaymentsService],
})
export class PaymentsModule {}
