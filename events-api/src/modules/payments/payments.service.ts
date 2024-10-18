import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { TicketPaymentReqDto } from '../tickets/dto/requests/ticket-payment.dto';
import { AxiosError } from 'axios';
import { axiosErrorMap } from 'src/shared/constants/axios-error-map.constant';

@Injectable()
export class PaymentsService {
  constructor(private readonly httpService: HttpService) {}

  async processPayment(dto: TicketPaymentReqDto) {
    const requestBody = {
      last4: dto.last4Digits.toString(),
      expiration: dto.cardExpiry,
      cardholder: dto.cardHolderName,
      amount: dto.paymentAmount,
      paymentToken: dto.paymentToken,
    };

    const transactionId = await this.httpService.axiosRef
      .post<IPaymentResponse>(`/payment`, requestBody)
      .then((response) => response.data.transactionId)
      .catch((error: unknown) => {
        if (error instanceof AxiosError && error.code) {
          throw axiosErrorMap[error.code];
        }

        throw new InternalServerErrorException('Cannot process payment');
      });

    return transactionId;
  }
}
