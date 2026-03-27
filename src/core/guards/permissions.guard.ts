import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthenticatedRequest } from "../config/interface/request.interface";
import {
  Permission,
  hasAnyPermission,
  hasAllPermissions,
} from "../config/rbac";

/**
 * Permission-based guard for fine-grained access control
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<Permission[]>(
      "permissions",
      context.getHandler(),
    );

    const requireAll =
      this.reflector.get<boolean>("requireAll", context.getHandler()) || false;

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request: AuthenticatedRequest = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException("Access denied: No role assigned");
    }

    const hasPermission = requireAll
      ? hasAllPermissions(user.role, requiredPermissions)
      : hasAnyPermission(user.role, requiredPermissions);

    if (!hasPermission) {
      throw new ForbiddenException(
        `Access denied: Insufficient permissions. Required: ${requiredPermissions.join(", ")}`,
      );
    }

    return true;
  }
}

/**
 * Enhanced role guard with permission checking
 */
@Injectable()
export class EnhancedRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      "roles",
      context.getHandler(),
    );

    const requiredPermissions = this.reflector.get<Permission[]>(
      "permissions",
      context.getHandler(),
    );

    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const request: AuthenticatedRequest = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException("Access denied: No role assigned");
    }

    // Check role-based access
    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException(
          `Access denied: Insufficient role. Required: ${requiredRoles.join(", ")}`,
        );
      }
    }

    // Check permission-based access
    if (requiredPermissions && requiredPermissions.length > 0) {
      const requireAll =
        this.reflector.get<boolean>("requireAll", context.getHandler()) ||
        false;

      const hasPermission = requireAll
        ? hasAllPermissions(user.role, requiredPermissions)
        : hasAnyPermission(user.role, requiredPermissions);

      if (!hasPermission) {
        throw new ForbiddenException(
          `Access denied: Insufficient permissions. Required: ${requiredPermissions.join(", ")}`,
        );
      }
    }

    return true;
  }
}

/**
 * Route-based permission guard that automatically checks permissions based on route
 */
@Injectable()
export class RoutePermissionsGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException("Access denied: No role assigned");
    }

    const method = request.method;
    const path = request.route?.path || request.url;

    // Import here to avoid circular dependency
    const { canAccessRoute } = await import("../config/rbac");

    if (!canAccessRoute(user.role, method, path)) {
      throw new ForbiddenException(
        `Access denied: Insufficient permissions for ${method} ${path}`,
      );
    }

    return true;
  }
}
