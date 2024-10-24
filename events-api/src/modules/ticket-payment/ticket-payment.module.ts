import { Module } from '@nestjs/common';
import { TicketPaymentService } from './ticket-payment.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfig } from 'src/shared/configs/env.config';

@Module({
  providers: [TicketPaymentService],
  exports: [TicketPaymentService],
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<EnvConfig, true>) => ({
        timeout: 3000,
        baseURL: configService.get('PAYMENT_API_URL'),
        headers: {
          Authorization: `Bearer ${configService.get('PAYMENT_API_ACCESS_TOKEN')}`,
        },
      }),
    }),
  ],
})
export class TicketPaymentModule {}
