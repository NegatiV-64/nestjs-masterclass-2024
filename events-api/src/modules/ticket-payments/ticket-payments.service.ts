import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PayTicketReqDto } from '../tickets/dto/requests/pay-ticket.dto';
import { HttpService } from '@nestjs/axios';
import { plainToClass } from 'class-transformer';
import { TicketPaymentResponseDataDto } from './dto/responses/ticket-payment-response.dto';
import { validate } from 'class-validator';
import { axiosRequest } from 'src/shared/utils/axios.request';

@Injectable()
export class TicketPaymentsService {
  constructor(private readonly httpService: HttpService) {}

  async processPayment(dto: PayTicketReqDto): Promise<TicketPaymentResponseDataDto> {
    const transformedDto = {
      last4: dto.last4Digits,
      expiration: dto.cardExpiry,
      cardholder: dto.cardHolderName,
      amount: dto.paymentAmount,
      paymentToken: dto.paymentToken,
    };

    const paymentResponse = await axiosRequest<TicketPaymentResponseDataDto>(this.httpService.axiosRef, {
      url: '/payment',
      method: 'POST',
      data: transformedDto,
    });

    if (paymentResponse instanceof Error) {
      Logger.error(paymentResponse);
      throw new BadRequestException('Payment failed. ' + paymentResponse?.message);
    }

    const paymentResponseDataDto = plainToClass(TicketPaymentResponseDataDto, paymentResponse.data);
    const errors = await validate(paymentResponseDataDto);

    if (errors.length > 0) {
      throw new BadRequestException('Payment failed. Invalid payment response data');
    }

    return paymentResponse.data;
  }
}
