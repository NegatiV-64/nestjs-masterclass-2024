import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import onFinished from 'on-finished';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    onFinished(res, () => Logger.log(`[${res.statusCode}] ${req.method}: ${req.baseUrl + req.url}`));

    next();
  }
}
