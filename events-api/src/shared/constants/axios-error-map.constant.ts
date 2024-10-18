import { BadRequestException, ServiceUnavailableException } from '@nestjs/common';

export const axiosErrorMap = {
  ECONNREFUSED: new ServiceUnavailableException('Payment service is currently unavailable'),
  ERR_BAD_REQUEST: new BadRequestException('Invalid card number'),
};
