import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
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
      if (error.code === "ECONNREFUSED") {
        throw new ServiceUnavailableException("Payment service is unavailable");
      } else if(error.code === "ERR_BAD_REQUEST") {
        throw new BadRequestException("Card number is incorrect");
      } else {
        throw new InternalServerErrorException("Payment failed");
      }
    }
  }
}
