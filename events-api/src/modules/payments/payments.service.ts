import { BadRequestException, Injectable, InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { TicketPaymentReqDto } from '../tickets/dto/requests/ticket-payment.dto';
import { EnvConfig } from 'src/shared/configs/env.config';
import { AxiosError } from 'axios';

@Injectable()
export class PaymentsService {
  constructor(
    private configService: ConfigService<EnvConfig>,
    private httpService: HttpService,
  ) {}

  async processPayment(dto: TicketPaymentReqDto) {
    const requestBody = {
      last4: dto.last4Digits.toString(),
      expiration: dto.cardExpiry,
      cardholder: dto.cardHolderName,
      amount: dto.paymentAmount,
      paymentToken: dto.paymentToken,
    };

    const paymentApiUrl = this.configService.getOrThrow('PAYMENT_API_URL', {
      infer: true,
    });

    const paymentApiAccessToken = this.configService.getOrThrow('PAYMENT_API_ACCESS_TOKEN', {
      infer: true,
    });

    try {
      const { data } = await firstValueFrom(
        this.httpService.post<IPaymentResponse>(`${paymentApiUrl}/payment`, requestBody, {
          headers: {
            Authorization: `Bearer ${paymentApiAccessToken}`,
          },
        }),
      );

      if (data.message === 'Payment successful') {
        return data.transactionId;
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.code === 'ECONNREFUSED') {
          throw new ServiceUnavailableException('Payment service is currently unavailable');
        } else if (error.code === 'ERR_BAD_REQUEST') {
          throw new BadRequestException('Invalid card number');
        }
      }
      throw new ServiceUnavailableException('Error during payment processing');
    }
  }
}
