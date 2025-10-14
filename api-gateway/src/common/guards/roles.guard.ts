import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { RequestWithUserContext } from '../types/request-with-context.type';

/**
 * Guard that checks if the user has the required roles to access a route.
 *
 * Used with metadata set by a @Roles() decorator.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  /** Logger instance scoped to JwtGatewayGuard. */
  private readonly logger = new Logger(RolesGuard.name);

  /**
   * Constructs the RolesGuard with necessary dependencies.
   *
   * @param {Reflector} reflector - Used to access route handler metadata.
   */
  constructor(private reflector: Reflector) {}

  /**
   * Validates user roles against the required roles for the route.
   *
   * @param context - The current execution context.
   * @returns Whether the user is allowed to proceed.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // For no role, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUserContext>();
    const user = request.user;

    if (!user) {
      this.logger.warn('Access denied: No user attached to request');
      throw new ForbiddenException('User not authenticated');
    }

    const userRoles: Role[] = user.roles || [];

    const hasRole = requiredRoles.some((role: Role) =>
      userRoles.includes(role),
    );

    if (!hasRole) {
      this.logger.warn(
        `Access denied: User ${user.id || user.username} lacks roles ${requiredRoles.join(', ')}`,
      );
      throw new ForbiddenException('Insufficient role permissions');
    }

    this.logger.debug(
      `Access granted for ${user.username || user.id} with roles: ${userRoles.join(', ')}`,
    );

    return true;
  }
}
