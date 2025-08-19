// ==================================
// SYSTEM & GENERIC ERRORS
// ==================================
export const SYSTEM_ERRORS = {
  BOOTSTRAP_FAILED: 'Error during application bootstrap',
};

// ==================================
// AUTHENTICATION & PERMISSION ERRORS
// ==================================
export const AUTH_ERRORS = {
  // Login
  INVALID_CREDENTIALS: 'Invalid credentials',

  // Guards & Tokens
  AUTHENTICATION_REQUIRED: 'Authentication is required.',
  SESSION_ID_NOT_FOUND: 'Session ID not found in token.',

  // Refresh Token
  REFRESH_TOKEN_MISSING: 'Refresh token is missing.',
  REFRESH_TOKEN_INVALID_PAYLOAD: 'Invalid refresh token payload.',
  REFRESH_TOKEN_INVALID_OR_EXPIRED: 'Refresh token is invalid or expired.',

  // Session validation
  NO_ACTIVE_SESSIONS: 'No active sessions found.',
  SESSION_INVALID: 'Session is invalid or has expired.', // Giữ lại cho các trường hợp chung
  USER_FOR_SESSION_NOT_FOUND: 'User for this session not found.',
};

export const PERMISSION_ERRORS = {
  INVALID_IDS: 'One or more permission IDs are invalid.',
};

// ==================================
// DOMAIN-SPECIFIC ERRORS
// ==================================
export const USER_ERRORS = {
  NOT_FOUND: (id: string) => `User with ID "${id}" not found.`,
  ALREADY_EXISTS: (email: string) =>
    `User with email "${email}" already exists.`,
  ALREADY_DELETED: 'Cannot delete a user that has already been deleted.',
  CANNOT_UPDATE_DELETED: 'Cannot update a deleted user.',
  IS_ACTIVE: 'Cannot restore an active user.',
  INCONSISTENT_DEPARTMENT:
    'Department does not belong to the specified office.',
};

export const ROLE_ERRORS = {
  NOT_FOUND: (id: string) => `Role with ID "${id}" not found.`,
  ALREADY_EXISTS: (name: string) => `Role with name "${name}" already exists.`,
  ALREADY_DELETED: 'Cannot delete a role that has already been deleted.',
  CANNOT_UPDATE_DELETED: 'Cannot update a deleted role.',
  IS_ACTIVE: 'Cannot restore an active role.',
};

export const OFFICE_ERRORS = {
  NOT_FOUND: (id: string) => `Office with ID "${id}" not found.`,
  DUPLICATE:
    'Office with the same international name, short name, or tax code already exists.',
  ALREADY_DELETED: 'Cannot delete an office that has already been deleted.',
  CANNOT_UPDATE_DELETED: 'Cannot update a deleted office.',
  IS_ACTIVE: 'Cannot restore an active office.',
};

export const DEPARTMENT_ERRORS = {
  NOT_FOUND: (id: string) => `Department with ID "${id}" not found.`,
  ALREADY_EXISTS: (name: string) =>
    `Department with name "${name}" already exists.`,
  ALREADY_DELETED: 'Cannot delete a department that has already been deleted.',
  CANNOT_UPDATE_DELETED: 'Cannot update a deleted department.',
  IS_ACTIVE: 'Cannot restore an active department.',
};

export const STATUS_LABEL_ERRORS = {
  NOT_FOUND: (id: string) => `StatusLabel with ID "${id}" not found.`,
  ALREADY_EXISTS: (name: string) =>
    `StatusLabel with name "${name}" already exists.`,
  ALREADY_DELETED:
    'Cannot delete a status label that has already been deleted.',
  CANNOT_UPDATE_DELETED: 'Cannot update a deleted status label.',
  IS_ACTIVE: 'Cannot restore an active status label.',
};

export const CATEGORY_ERRORS = {
  NOT_FOUND: (id: string) => `Category with ID "${id}" not found.`,
  ALREADY_EXISTS: (name: string) =>
    `Category with name "${name}" already exists.`,
  ALREADY_DELETED: 'Cannot delete a category that has already been deleted.',
  CANNOT_UPDATE_DELETED: 'Cannot update a deleted category.',
  IS_ACTIVE: 'Cannot restore an active category.',
};

export const MANUFACTURER_ERRORS = {
  NOT_FOUND: (id: string) => `Manufacturer with ID "${id}" not found.`,
  ALREADY_EXISTS: (name: string) =>
    `Manufacturer with name "${name}" already exists.`,
  ALREADY_DELETED:
    'Cannot delete a manufacturer that has already been deleted.',
  CANNOT_UPDATE_DELETED: 'Cannot update a deleted manufacturer.',
  IS_ACTIVE: 'Cannot restore an active manufacturer.',
};

// ==================================
// SEEDER ERRORS
// ==================================
export const SEEDER_ERRORS = {
  ADMIN_ROLE_FAILURE: 'Failed to create or find ADMIN role.',
  ADMIN_USER_FAILURE: 'Failed to create or find ADMIN user.',
  SEEDING_FAILED: 'Error during seeding admin user',
};
