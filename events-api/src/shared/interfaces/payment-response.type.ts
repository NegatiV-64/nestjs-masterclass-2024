type PaymentSuccessResponse = {
  message: string;
  transactionId: string;
};

type PaymentFailureResponse = {
  message: string;
  transactionId: string;
  error: {};
};

type IPaymentResponse = PaymentSuccessResponse | PaymentFailureResponse;
