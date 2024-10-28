export class PayTicketDto {
  last4Digits: string;
  cardExpiry: string;
  cardHolderName: string;
  paymentToken: string;
  paymentAmount: number;
}
