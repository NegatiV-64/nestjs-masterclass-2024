import { Injectable, HttpStatus } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';

@Injectable()
export class ParsingUUIDPipe extends ParseUUIDPipe {
  constructor() {
    super({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      version: '4',
    });
  }
}
