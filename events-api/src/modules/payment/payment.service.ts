import { Injectable, ServiceUnavailableException, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { PayTicketDto } from '../tickets/dto/requests/pay-ticket.dto';

@Injectable()
export class PaymentService {
  async processPayment(paymentData: PayTicketDto): Promise<any> {
    const paymentApiPort = process.env.PAYMENT_API_URL;
    const paymentApiUrl = `http://localhost:${paymentApiPort}/payment`;

    try {
      const response = await axios.post(paymentApiUrl, paymentData, {
        headers: {
          Authorization: `Bearer ${process.env.PAYMENT_API_ACCESS_TOKEN}`,
        },
      });

      if (response.status === 200) {
        return {
          message: response.data.message,
          transactionId: response.data.transactionId,
        };
      } else {
        throw new InternalServerErrorException('Payment processing failed.');
      }
    } catch (error) {
      if (error.response?.status === 503) {
        throw new ServiceUnavailableException('Payment system is currently unavailable. Please try again later.');
      }
      throw new InternalServerErrorException('Payment failed: ' + error.message);
    }
  }
}
