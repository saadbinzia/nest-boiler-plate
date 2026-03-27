import { GlobalEnums } from "./globalEnums";

const { USER_ROLES } = GlobalEnums;

/**
 * Permission types for the RBAC system
 */
export enum Permission {
  // User Management
  USERS_VIEW = "users.view",
  USERS_CREATE = "users.create",
  USERS_EDIT = "users.edit",
  USERS_DELETE = "users.delete",
  USERS_DELETE_MANAGERS = "users.delete_managers",
  USERS_MANAGE_STAFF = "users.manage_staff",
  USERS_MANAGE_TENANTS = "users.manage_tenants",

  // Properties Management
  PROPERTIES_VIEW = "properties.view",
  PROPERTIES_CREATE = "properties.create",
  PROPERTIES_EDIT = "properties.edit",
  PROPERTIES_DELETE = "properties.delete",
  PROPERTIES_MANAGE_BUILDINGS = "properties.manage_buildings",
  PROPERTIES_MANAGE_FLOORS = "properties.manage_floors",
  PROPERTIES_MANAGE_SPACES = "properties.manage_spaces",

  // Lease & Tenant Management
  LEASES_VIEW = "leases.view",
  LEASES_CREATE = "leases.create",
  LEASES_EDIT = "leases.edit",
  LEASES_DELETE = "leases.delete",
  LEASES_TERMINATE = "leases.terminate",
  TENANTS_VIEW = "tenants.view",
  TENANTS_CREATE = "tenants.create",
  TENANTS_EDIT = "tenants.edit",
  TENANTS_DELETE = "tenants.delete",

  // System Management
  SYSTEM_SETTINGS = "system.settings",
  SYSTEM_REPORTS = "system.reports",
  SYSTEM_ANALYTICS = "system.analytics",

  // Dashboard Management
  DASHBOARD_VIEW_PRICE_PER_SQM = "dashboard.view_price_per_sqm",
  DASHBOARD_VIEW_REVENUE_TREND = "dashboard.view_revenue_trend",

  // Profile Management
  PROFILE_VIEW = "profile.view",
  PROFILE_EDIT = "profile.edit",
}

/**
 * Role hierarchy (higher number = more permissions)
 */
export const ROLE_HIERARCHY: Record<string, number> = {
  [USER_ROLES.USER]: 1,
  [USER_ROLES.ADMIN]: 2,
};

/**
 * Permission mappings for each role
 *
 * ADMIN (Owner/Admin): Full access - can do everything
 * USER: Basic profile access only
 */
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  // Super Admin - Full access to everything
  [USER_ROLES.ADMIN]: [
    Permission.USERS_VIEW,
    Permission.USERS_CREATE,
    Permission.USERS_EDIT,
    Permission.USERS_DELETE,
    Permission.USERS_DELETE_MANAGERS,
    Permission.USERS_MANAGE_STAFF,
    Permission.USERS_MANAGE_TENANTS,
    Permission.PROPERTIES_VIEW,
    Permission.PROPERTIES_CREATE,
    Permission.PROPERTIES_EDIT,
    Permission.PROPERTIES_DELETE,
    Permission.PROPERTIES_MANAGE_BUILDINGS,
    Permission.PROPERTIES_MANAGE_FLOORS,
    Permission.PROPERTIES_MANAGE_SPACES,
    Permission.LEASES_VIEW,
    Permission.LEASES_CREATE,
    Permission.LEASES_EDIT,
    Permission.LEASES_DELETE,
    Permission.LEASES_TERMINATE,
    Permission.TENANTS_VIEW,
    Permission.TENANTS_CREATE,
    Permission.TENANTS_EDIT,
    Permission.TENANTS_DELETE,
    Permission.SYSTEM_SETTINGS,
    Permission.SYSTEM_REPORTS,
    Permission.SYSTEM_ANALYTICS,
    Permission.PROFILE_VIEW,
    Permission.PROFILE_EDIT,
    Permission.DASHBOARD_VIEW_PRICE_PER_SQM,
    Permission.DASHBOARD_VIEW_REVENUE_TREND,
  ],

  // User - Basic permissions only
  [USER_ROLES.USER]: [Permission.PROFILE_VIEW, Permission.PROFILE_EDIT],
};

/**
 * Route-based permission mappings
 */
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  // User Management Routes
  "GET /admin/users": [Permission.USERS_VIEW],
  "POST /admin/users": [Permission.USERS_CREATE],
  "PUT /admin/users/:id": [Permission.USERS_EDIT],
  "DELETE /admin/users/:id": [Permission.USERS_DELETE],
  "GET /admin/users/staff": [Permission.USERS_MANAGE_STAFF],
  "GET /admin/users/tenants": [Permission.USERS_MANAGE_TENANTS],
  "POST /admin/users/create-user": [Permission.USERS_CREATE],

  // Properties Management Routes
  "GET /admin/properties": [Permission.PROPERTIES_VIEW],
  "GET /admin/properties/dashboard": [Permission.PROPERTIES_VIEW],
  "GET /admin/properties/buildings": [Permission.PROPERTIES_MANAGE_BUILDINGS],
  "POST /admin/properties/buildings": [
    Permission.PROPERTIES_CREATE,
    Permission.PROPERTIES_MANAGE_BUILDINGS,
  ],
  "PUT /admin/properties/buildings/:id": [
    Permission.PROPERTIES_EDIT,
    Permission.PROPERTIES_MANAGE_BUILDINGS,
  ],
  "DELETE /admin/properties/buildings/:id": [
    Permission.PROPERTIES_DELETE,
    Permission.PROPERTIES_MANAGE_BUILDINGS,
  ],
  "GET /admin/properties/floors": [Permission.PROPERTIES_MANAGE_FLOORS],
  "POST /admin/properties/floors": [
    Permission.PROPERTIES_CREATE,
    Permission.PROPERTIES_MANAGE_FLOORS,
  ],
  "PUT /admin/properties/floors/:id": [
    Permission.PROPERTIES_EDIT,
    Permission.PROPERTIES_MANAGE_FLOORS,
  ],
  "DELETE /admin/properties/floors/:id": [
    Permission.PROPERTIES_DELETE,
    Permission.PROPERTIES_MANAGE_FLOORS,
  ],
  "GET /admin/properties/spaces": [Permission.PROPERTIES_MANAGE_SPACES],
  "POST /admin/properties/spaces": [
    Permission.PROPERTIES_CREATE,
    Permission.PROPERTIES_MANAGE_SPACES,
  ],
  "PUT /admin/properties/spaces/:id": [
    Permission.PROPERTIES_EDIT,
    Permission.PROPERTIES_MANAGE_SPACES,
  ],
  "DELETE /admin/properties/spaces/:id": [
    Permission.PROPERTIES_DELETE,
    Permission.PROPERTIES_MANAGE_SPACES,
  ],

  // System Routes
  "GET /admin/settings": [Permission.SYSTEM_SETTINGS],
  "PUT /admin/settings": [Permission.SYSTEM_SETTINGS],
  "GET /admin/reports": [Permission.SYSTEM_REPORTS],
  "GET /admin/analytics": [Permission.SYSTEM_ANALYTICS],

  // Profile Routes
  "GET /shared/users/find": [Permission.PROFILE_VIEW],
  "PUT /shared/users/update": [Permission.PROFILE_EDIT],
  "PUT /shared/users/upload-profile-image": [Permission.PROFILE_EDIT],
  "PUT /shared/users/change-password": [Permission.PROFILE_EDIT],
};

/**
 * Helper function to check if a role has a specific permission
 */
export function hasPermission(
  userRole: string,
  permission: Permission,
): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
}

/**
 * Helper function to check if a role has any of the required permissions
 */
export function hasAnyPermission(
  userRole: string,
  permissions: Permission[],
): boolean {
  return permissions.some((permission) => hasPermission(userRole, permission));
}

/**
 * Helper function to check if a role has all of the required permissions
 */
export function hasAllPermissions(
  userRole: string,
  permissions: Permission[],
): boolean {
  return permissions.every((permission) => hasPermission(userRole, permission));
}

/**
 * Helper function to check role hierarchy
 */
export function hasRoleOrHigher(
  userRole: string,
  requiredRole: string,
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Helper function to get required permissions for a route
 */
export function getRoutePermissions(
  method: string,
  path: string,
): Permission[] {
  const routeKey = `${method.toUpperCase()} ${path}`;

  // Try exact match first
  if (ROUTE_PERMISSIONS[routeKey]) {
    return ROUTE_PERMISSIONS[routeKey];
  }

  // Try pattern matching for dynamic routes
  for (const [pattern, permissions] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pattern.includes(":")) {
      const regex = new RegExp(pattern.replace(/:\w+/g, "[^/]+"));
      if (regex.test(routeKey)) {
        return permissions;
      }
    }
  }

  // Default to no permissions required
  return [];
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(userRole: string): Permission[] {
  return ROLE_PERMISSIONS[userRole] || [];
}

/**
 * Check if user can access a specific route
 */
export function canAccessRoute(
  userRole: string,
  method: string,
  path: string,
): boolean {
  const requiredPermissions = getRoutePermissions(method, path);

  if (requiredPermissions.length === 0) {
    return true;
  }

  return hasAnyPermission(userRole, requiredPermissions);
}
