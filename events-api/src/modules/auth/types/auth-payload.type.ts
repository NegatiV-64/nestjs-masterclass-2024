import { UserRole } from 'src/shared/constants/user-role.constant';

export interface AuthTokenPayload {
  sub: string;
  userEmail: string;
  userRole: UserRole;
}
