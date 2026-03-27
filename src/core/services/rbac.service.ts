import { Injectable } from "@nestjs/common";
import {
  Permission,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRoleOrHigher,
  getRolePermissions,
  canAccessRoute,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
} from "../config/rbac";

export interface UserPermissions {
  role: string;
  permissions: Permission[];
  canViewUsers: boolean;
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canManageStaff: boolean;
  canManageTenants: boolean;
  canViewProperties: boolean;
  canCreateProperties: boolean;
  canEditProperties: boolean;
  canDeleteProperties: boolean;
  canManageBuildings: boolean;
  canManageFloors: boolean;
  canManageSpaces: boolean;
  canAccessSettings: boolean;
  canViewReports: boolean;
  canViewAnalytics: boolean;
  canViewProfile: boolean;
  canEditProfile: boolean;
}

@Injectable()
export class RbacService {
  /**
   * Check if user has a specific permission
   */
  hasPermission(userRole: string, permission: Permission): boolean {
    return hasPermission(userRole, permission);
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(userRole: string, permissions: Permission[]): boolean {
    return hasAnyPermission(userRole, permissions);
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(userRole: string, permissions: Permission[]): boolean {
    return hasAllPermissions(userRole, permissions);
  }

  /**
   * Check if user has a specific role or higher
   */
  hasRoleOrHigher(userRole: string, requiredRole: string): boolean {
    return hasRoleOrHigher(userRole, requiredRole);
  }

  /**
   * Check if user is a specific role
   */
  isRole(userRole: string, role: string): boolean {
    return userRole === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(userRole: string, roles: string[]): boolean {
    return roles.includes(userRole);
  }

  /**
   * Check if user has all of the specified roles
   */
  hasAllRoles(userRole: string, roles: string[]): boolean {
    return roles.every((role) => userRole === role);
  }

  /**
   * Get all permissions for a user role
   */
  getUserPermissions(userRole: string): Permission[] {
    return getRolePermissions(userRole);
  }

  /**
   * Check if user can access a specific route
   */
  canAccessRoute(userRole: string, method: string, path: string): boolean {
    return canAccessRoute(userRole, method, path);
  }

  /**
   * Get detailed permissions for a user role
   */
  getUserPermissionDetails(userRole: string): UserPermissions {
    const permissions = this.getUserPermissions(userRole);

    return {
      role: userRole,
      permissions,
      canViewUsers: this.hasPermission(userRole, Permission.USERS_VIEW),
      canCreateUsers: this.hasPermission(userRole, Permission.USERS_CREATE),
      canEditUsers: this.hasPermission(userRole, Permission.USERS_EDIT),
      canDeleteUsers: this.hasPermission(userRole, Permission.USERS_DELETE),
      canManageStaff: this.hasPermission(
        userRole,
        Permission.USERS_MANAGE_STAFF,
      ),
      canManageTenants: this.hasPermission(
        userRole,
        Permission.USERS_MANAGE_TENANTS,
      ),
      canViewProperties: this.hasPermission(
        userRole,
        Permission.PROPERTIES_VIEW,
      ),
      canCreateProperties: this.hasPermission(
        userRole,
        Permission.PROPERTIES_CREATE,
      ),
      canEditProperties: this.hasPermission(
        userRole,
        Permission.PROPERTIES_EDIT,
      ),
      canDeleteProperties: this.hasPermission(
        userRole,
        Permission.PROPERTIES_DELETE,
      ),
      canManageBuildings: this.hasPermission(
        userRole,
        Permission.PROPERTIES_MANAGE_BUILDINGS,
      ),
      canManageFloors: this.hasPermission(
        userRole,
        Permission.PROPERTIES_MANAGE_FLOORS,
      ),
      canManageSpaces: this.hasPermission(
        userRole,
        Permission.PROPERTIES_MANAGE_SPACES,
      ),
      canAccessSettings: this.hasPermission(
        userRole,
        Permission.SYSTEM_SETTINGS,
      ),
      canViewReports: this.hasPermission(userRole, Permission.SYSTEM_REPORTS),
      canViewAnalytics: this.hasPermission(
        userRole,
        Permission.SYSTEM_ANALYTICS,
      ),
      canViewProfile: this.hasPermission(userRole, Permission.PROFILE_VIEW),
      canEditProfile: this.hasPermission(userRole, Permission.PROFILE_EDIT),
    };
  }

  /**
   * Get role hierarchy level
   */
  getRoleLevel(userRole: string): number {
    return ROLE_HIERARCHY[userRole] || 0;
  }

  /**
   * Check if user role is higher than or equal to required role
   */
  isRoleHigherOrEqual(userRole: string, requiredRole: string): boolean {
    return this.getRoleLevel(userRole) >= this.getRoleLevel(requiredRole);
  }

  /**
   * Get all available roles
   */
  getAvailableRoles(): string[] {
    return Object.keys(ROLE_PERMISSIONS);
  }

  /**
   * Get all available permissions
   */
  getAvailablePermissions(): Permission[] {
    return Object.values(Permission);
  }

  /**
   * Validate if a role exists
   */
  isValidRole(role: string): boolean {
    return this.getAvailableRoles().includes(role);
  }

  /**
   * Validate if a permission exists
   */
  isValidPermission(permission: Permission): boolean {
    return this.getAvailablePermissions().includes(permission);
  }

  /**
   * Get permissions that a role is missing compared to another role
   */
  getMissingPermissions(userRole: string, targetRole: string): Permission[] {
    const userPermissions = this.getUserPermissions(userRole);
    const targetPermissions = this.getUserPermissions(targetRole);

    return targetPermissions.filter(
      (permission) => !userPermissions.includes(permission),
    );
  }

  /**
   * Check if user can perform action on resource
   */
  canPerformAction(
    userRole: string,
    action: string,
    resource: string,
  ): boolean {
    const permission = `${resource}.${action}` as Permission;
    return this.hasPermission(userRole, permission);
  }

  /**
   * Get accessible routes for a user role
   */
  getAccessibleRoutes(userRole: string): string[] {
    const accessibleRoutes: string[] = [];

    // This would need to be implemented based on your route structure
    // For now, return basic accessible routes
    const permissions = this.getUserPermissions(userRole);

    if (permissions.includes(Permission.USERS_VIEW)) {
      accessibleRoutes.push("GET /admin/users");
    }
    if (permissions.includes(Permission.USERS_CREATE)) {
      accessibleRoutes.push("POST /admin/users");
    }
    if (permissions.includes(Permission.PROPERTIES_VIEW)) {
      accessibleRoutes.push("GET /admin/properties");
    }
    if (permissions.includes(Permission.SYSTEM_SETTINGS)) {
      accessibleRoutes.push("GET /admin/settings");
    }

    return accessibleRoutes;
  }
}
