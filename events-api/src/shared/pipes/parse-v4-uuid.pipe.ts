import { HttpStatus, ParseUUIDPipe } from '@nestjs/common';

export class UUIDV4Pipe extends ParseUUIDPipe {
  constructor() {
    super({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      version: '4',
    });
  }
}
