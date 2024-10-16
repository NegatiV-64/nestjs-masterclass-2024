import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PaymentService {
  constructor(private readonly httpService: HttpService) {}

  async processPayment(paymentData: any): Promise<any> {
    const paymentApiPort = process.env.PAYMENT_API_URL;
    const paymentApiUrl = `http://localhost:${paymentApiPort}/payment`;

    console.log('Payment API URL:', paymentApiUrl);
    console.log('Access Token:', process.env.PAYMENT_API_ACCESS_TOKEN);
    console.log(paymentData);
    try {
      const response = await lastValueFrom(
        this.httpService.post(paymentApiUrl, paymentData, {
          headers: {
            Authorization: `Bearer ${process.env.PAYMENT_API_ACCESS_TOKEN}`,
          },
        }),
      );
      if (response.status === 200) {
        return {
          message: response.data.message,
          transactionId: response.data.transactionId,
        };
      } else {
        throw new BadRequestException('Payment processing failed.');
      }
    } catch (error) {
      throw new BadRequestException('Payment failed: ' + (error.response?.data?.message || error.message));
    }
  }
}
