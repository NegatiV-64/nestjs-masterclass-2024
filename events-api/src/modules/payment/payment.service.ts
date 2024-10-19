import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaymentDetailsDto } from './dto/response/payment-details.dto';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { SuccessPaymentResDto } from './dto/response/success-response.dto';
import { ErrorPaymentResDto } from './dto/response/error-response.dto';

@Injectable()
export class PaymentService {
  private paymentApiUrl: string;
  private paymentApiAccessToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const paymentApiUrl = configService.get<string>('PAYMENT_API_URL');
    const paymentApiAccessToken = configService.get<string>('PAYMENT_API_ACCESS_TOKEN');

    if (!paymentApiUrl || !paymentApiAccessToken) {
      throw new InternalServerErrorException('Payment credentials are missing');
    }

    this.paymentApiUrl = paymentApiUrl;
    this.paymentApiAccessToken = paymentApiAccessToken;
  }

  async pay(paymentDetails: PaymentDetailsDto) {
    const { data } = await firstValueFrom(
      this.httpService.post<SuccessPaymentResDto | ErrorPaymentResDto>(`${this.paymentApiUrl}/payment`, paymentDetails, {
        headers: {
          Authorization: `Bearer ${this.paymentApiAccessToken}`,
        },
      }),
    );

    return data;
  }
}
