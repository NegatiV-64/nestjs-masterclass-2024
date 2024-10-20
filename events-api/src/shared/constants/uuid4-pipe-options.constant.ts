import { HttpStatus, ParseUUIDPipeOptions } from '@nestjs/common';

export const UUID4PipeOptions: ParseUUIDPipeOptions = {
  errorHttpStatusCode: HttpStatus.BAD_REQUEST,
  version: '4',
} as const;
