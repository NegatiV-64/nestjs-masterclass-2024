import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../constants/user-role.constant';

const ROLES_DECORATOR_KEY = 'roles';

@Injectable()
/**
 * Guard that determines whether a user has the necessary roles to access a route.
 */
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const allowedRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_DECORATOR_KEY, [context.getHandler(), context.getClass()]);

    if (!allowedRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return allowedRoles.includes(user.userRole);
  }
}

/**
 * A decorator function that assigns roles to a route handler or controller.
 *
 * @param roles - A list of roles that are allowed to access the route.
 * @returns A custom metadata decorator that sets the roles.
 */
export const Roles = (...roles: UserRole[]) => {
  return SetMetadata(ROLES_DECORATOR_KEY, roles);
};
