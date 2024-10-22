import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../shared/configs/env.config';

@Module({
  providers: [PaymentService],
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<EnvConfig>) => ({
        baseURL: configService.getOrThrow('PAYMENT_API_URL', {
          infer: true,
        }),
        headers: {
          Authorization: `Bearer ${configService.getOrThrow('PAYMENT_API_ACCESS_TOKEN')}`,
        },
      }),
    }),
  ],
  exports: [PaymentService],
})
export class PaymentModule {}