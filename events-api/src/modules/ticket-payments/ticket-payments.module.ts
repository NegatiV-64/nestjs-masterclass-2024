import { Module } from '@nestjs/common';
import { TicketPaymentsService } from './ticket-payments.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [TicketPaymentsService],
  exports: [TicketPaymentsService],
  imports: [
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get('PAYMENT_API_URL'),
        headers: {
          Authorization: `Bearer ${configService.get('PAYMENT_API_ACCESS_TOKEN')}`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class TicketPaymentsModule {}
