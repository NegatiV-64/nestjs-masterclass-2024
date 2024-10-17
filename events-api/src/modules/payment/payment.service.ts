import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable } from "@nestjs/common";
import { AxiosError } from "axios";
import { lastValueFrom } from "rxjs";


@Injectable()
export class PaymentService {
  constructor(private readonly httpService: HttpService){}

  async payingProcess(paymentData: any) {
    const paymentApi = process.env.PAYMENT_API_URL
    if (!paymentApi) {
      throw new BadRequestException('Cannot find payment Api')
    }

    try {
      const response = await lastValueFrom(
        this.httpService.post(paymentApi, paymentData, {
          headers: {
            Authorization: `Bearer ${process.env.PAYMENT_API_ACCESS_TOKEN}`
          }
        })
      );

      if (response.status === 200) {
        return {
          paymentStatus: 'Successfully paid',
          transactionId: response.data.transactionId,
        }
      } else {
        return {
          paymentStatus: 'Transaction failed',
          transactionId: response.data.transactionId,
        }
      }
    } catch (error) {
      throw new BadRequestException('Payment process failed')
    }
  }
}