import { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    userId: string;
    userEmail: string;
    userRole: string;
  };
}
