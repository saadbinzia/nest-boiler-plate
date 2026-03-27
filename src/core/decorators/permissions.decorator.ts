import { SetMetadata } from "@nestjs/common";
import { Permission } from "../config/rbac";

/**
 * Decorator to specify required permissions for a route
 * @param {Permission[]} permissions Array of permissions required
 * @param {boolean} requireAll Whether all permissions are required (default: false)
 */
export const RequirePermissions = (
  permissions: Permission[],
  requireAll: boolean = false,
) => {
  return (
    target: any,
    propertyKey?: string,
    descriptor?: PropertyDescriptor,
  ) => {
    SetMetadata("permissions", permissions)(target, propertyKey, descriptor);
    SetMetadata("requireAll", requireAll)(target, propertyKey, descriptor);
  };
};

/**
 * Decorator to specify a single permission
 * @param {Permission} permission Single permission required
 */
export const RequirePermission = (permission: Permission) => {
  return RequirePermissions([permission], true);
};

/**
 * Decorator to specify multiple permissions (any one required)
 * @param {Permission[]} permissions Array of permissions (any one required)
 */
export const RequireAnyPermission = (permissions: Permission[]) => {
  return RequirePermissions(permissions, false);
};

/**
 * Decorator to specify multiple permissions (all required)
 * @param {Permission[]} permissions Array of permissions (all required)
 */
export const RequireAllPermissions = (permissions: Permission[]) => {
  return RequirePermissions(permissions, true);
};

/**
 * Decorator to specify role hierarchy (user must have role or higher)
 * @param {string} role Required role or higher
 */
export const RequireRoleOrHigher = (role: string) => {
  return SetMetadata("requiredRole", role);
};

/**
 * Decorator to specify exact role match
 * @param {string} role Exact role required
 */
export const RequireExactRole = (role: string) => {
  return SetMetadata("exactRole", role);
};

/**
 * Decorator to specify multiple roles (any one required)
 * @param {string[]} roles Array of roles (any one required)
 */
export const RequireAnyRole = (roles: string[]) => {
  return SetMetadata("roles", roles);
};

/**
 * Decorator to specify multiple roles (all required)
 * @param {string[]} roles Array of roles (all required)
 */
export const RequireAllRoles = (roles: string[]) => {
  return SetMetadata("allRoles", roles);
};

/**
 * Decorator to bypass permission checking (use with caution)
 */
export const Public = () => {
  return SetMetadata("isPublic", true);
};

/**
 * Decorator to specify that route requires authentication but no specific permissions
 */
export const RequireAuth = () => {
  return SetMetadata("requireAuth", true);
};

/**
 * Decorator to specify admin-only access
 */
export const AdminOnly = () => {
  return RequireAnyRole(["ADMIN"]);
};
