import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { EnvConfig } from 'src/shared/configs/env.config';
import { PaymentDto } from '../tickets/dto/requests';

@Injectable()
export class PaymentService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService<EnvConfig>,
  ) {}

  async paymentProcess(dto: PaymentDto) {
    const reqBody = {
      last4: dto.last4Digits.toString(),
      expiration: dto.cardExpiry,
      cardholder: dto.cardHolderName,
      amount: dto.paymentAmount,
      paymentToken: dto.paymentToken,
    };
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.configService.getOrThrow('PAYMENT_API_URL')}/payment`, reqBody, {
          headers: { Authorization: `Bearer ${this.configService.getOrThrow('PAYMENT_API_ACCESS_TOKEN')}` },
        }),
      );
      
      return data.transactionId;
    } catch (error) {
      throw new ServiceUnavailableException("Payment failed");
    }
  }
}
