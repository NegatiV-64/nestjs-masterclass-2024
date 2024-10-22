import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException, ServiceUnavailableException } from "@nestjs/common";
import { PayTicketReqDto } from "../tickets/dto/payment-ticket.dto";
import { AxiosError } from "axios";


@Injectable()
export class PaymentService {
  constructor(private readonly httpService: HttpService){}

  async payingProcess(dto: PayTicketReqDto) {
    const paymentData = {
      last4: dto.last4Digits,
      expiration: dto.cardExpiry,
      cardholder: dto.cardHolderName,
      amount: dto.paymentAmount,
      paymentToken: dto.paymentToken,
    };

    const transactionId = await this.httpService.axiosRef
      .post('/payment', paymentData)
      .then((res) => res.data.transactionId)
      .catch((error) => {
        if (error instanceof AxiosError) {
          throw new ServiceUnavailableException('Payment is currently unavailable')
        }
        throw new InternalServerErrorException('Payment server error')
      })

    return transactionId
  }
}