import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PayTicketReqDto } from '../tickets/dto/requests/pay-ticket.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from 'src/shared/configs/env.config';

@Injectable()
export class TicketPaymentsService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService<EnvConfig, true>,
  ) {}

  async processPayment(dto: PayTicketReqDto) {
    const transformedDto = {
      last4: dto.last4Digits.toString(),
      expiration: dto.cardExpiry,
      cardholder: dto.cardHolderName,
      amount: dto.paymentAmount,
      paymentToken: dto.paymentToken,
    };

    const paymentResponse = await firstValueFrom(
      this.httpService
        .post(this.configService.get('PAYMENT_API_URL') + '/payment', transformedDto, {
          headers: {
            Authorization: `Bearer ${this.configService.get('PAYMENT_API_ACCESS_TOKEN')}`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            Logger.error(error);
            throw new BadRequestException('Payment failed');
          }),
        ),
    );

    return paymentResponse.data;
  }
}
