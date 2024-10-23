import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { TicketPaymentReqDto } from '../tickets/dto/requests';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from 'src/shared/configs/env.config';

@Injectable()
export class TicketPaymentService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService<EnvConfig, true>,
  ) {}

  async processTransaction(dto: TicketPaymentReqDto) {
    const transactionInfo = {
      last4: dto.last4Digits,
      expiration: dto.cardExpiry,
      cardholder: dto.cardHolderName,
      amount: dto.paymentAmount,
      paymentToken: dto.paymentToken,
    };

    try {
      const result = await this.httpService.axiosRef.post(this.configService.get('PAYMENT_API_URL') + '/payment', transactionInfo, {
        headers: {
          Authorization: `Bearer ${this.configService.get('PAYMENT_API_ACCESS_TOKEN')}`,
        },
      });

      return result.data;
    } catch (error) {
      if ('errors' in error) {
        throw new BadRequestException('Invalid Payment Information');
      }

      if ('error' in error) {
        throw new InternalServerErrorException();
      }
    }
  }
}
