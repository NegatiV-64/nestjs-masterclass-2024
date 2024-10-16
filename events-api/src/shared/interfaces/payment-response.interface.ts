type PaymentSuccessResponse = {
  message: string;
  transactionId: string;
};

type PaymentFailureResponse = {
  message: string;
  transactionId: string;
  error: string;
};

type IPaymentResponse = PaymentSuccessResponse | PaymentFailureResponse;
