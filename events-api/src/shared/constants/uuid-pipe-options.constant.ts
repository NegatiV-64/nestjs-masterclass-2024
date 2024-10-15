import { HttpStatus, ParseUUIDPipeOptions } from '@nestjs/common';

export const UUIDPipeOptions: ParseUUIDPipeOptions = {
  errorHttpStatusCode: HttpStatus.BAD_REQUEST,
  version: '4',
} as const;
