import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfig } from 'src/shared/configs/env.config';

@Module({
  providers: [PaymentsService],
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
  exports: [PaymentsService],
})
export class PaymentsModule {}
