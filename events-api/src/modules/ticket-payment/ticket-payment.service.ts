import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { TicketPaymentReqDto } from '../tickets/dto/requests';

@Injectable()
export class TicketPaymentService {
  constructor(private readonly httpService: HttpService) {}

  async processTransaction(dto: TicketPaymentReqDto) {
    const transactionInfo = {
      last4: dto.last4Digits,
      expiration: dto.cardExpiry,
      cardholder: dto.cardHolderName,
      amount: dto.paymentAmount,
      paymentToken: dto.paymentToken,
    };

    try {
      const result = await this.httpService.axiosRef.post('/payment', transactionInfo);

      return result.data;
    } catch (error) {
      if ('errors' in error) {
        throw new BadRequestException('Invalid Payment Information');
      }

      if ('error' in error) {
        throw new InternalServerErrorException('Transaction Failed, Server Dead');
      }
    }
  }
}
