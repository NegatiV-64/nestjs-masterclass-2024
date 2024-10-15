import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { ErrorMappings } from '../constants/prisma-error-mapping.constant';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const error = ErrorMappings[exception.code];

    if (error) {
      response.status(error.status).json({
        statusCode: error.status,
        message: error.message,
      });
    }

    super.catch(exception, host);
  }
}
