const PREFIX = '--- [PROJECTOR]';

const logTemplate = (
  status: 'Received' | 'Success' | 'Error',
  message: string,
) => {
  const templates = {
    Received: `${PREFIX} Received event: ${message}`,
    Success: `${PREFIX} Successfully processed: ${message}`,
    Error: `${PREFIX} ERROR processing: ${message}:`,
  };
  return templates[status];
};

export const PROJECTOR_LOGS = {
  USER_CREATED: {
    RECEIVED: logTemplate('Received', 'UserCreatedEvent'),
    SUCCESS: (id: string) => logTemplate('Success', `created user ${id}`),
    ERROR: (id: string) => logTemplate('Error', `creating user ${id}`),
  },
  USER_UPDATED: {
    RECEIVED: logTemplate('Received', 'UserUpdatedEvent'),
    SUCCESS: (id: string) => logTemplate('Success', `updated user ${id}`),
    ERROR: (id: string) => logTemplate('Error', `updating user ${id}`),
  },
  USER_DELETED: {
    RECEIVED: logTemplate('Received', 'UserDeletedEvent'),
    SUCCESS: (id: string) => logTemplate('Success', `deleted user ${id}`),
    ERROR: (id: string) => logTemplate('Error', `deleting user ${id}`),
  },
  USER_RESTORED: {
    RECEIVED: logTemplate('Received', 'UserRestoredEvent'),
    SUCCESS: (id: string) => logTemplate('Success', `restored user ${id}`),
    ERROR: (id: string) => logTemplate('Error', `restoring user ${id}`),
  },
  ROLE_ASSIGNED_TO_USER: {
    RECEIVED: logTemplate('Received', 'RoleAssignedToUserEvent'),
    SUCCESS: (userId: string, roleId: string) =>
      logTemplate('Success', `assigned role ${roleId} to user ${userId}`),
    ERROR: (userId: string, roleId: string) =>
      logTemplate('Error', `assigning role ${roleId} to user ${userId}`),
  },
  USER_OFFICE_CHANGED: {
    RECEIVED: logTemplate('Received', 'UserOfficeChangedEvent'),
    SUCCESS: (id: string) =>
      logTemplate('Success', `changed office for user ${id}`),
    ERROR: (id: string) =>
      logTemplate('Error', `changing office for user ${id}`),
  },
  USER_DEPARTMENT_CHANGED: {
    RECEIVED: logTemplate('Received', 'UserDepartmentChangedEvent'),
    SUCCESS: (id: string) =>
      logTemplate('Success', `changed department for user ${id}`),
    ERROR: (id: string) =>
      logTemplate('Error', `changing department for user ${id}`),
  },

  OFFICE_CREATED: {
    RECEIVED: logTemplate('Received', 'OfficeCreatedEvent'),
    SUCCESS: (id: string) => logTemplate('Success', `created office ${id}`),
    ERROR: (id: string) => logTemplate('Error', `creating office ${id}`),
  },
  OFFICE_UPDATED: {
    RECEIVED: logTemplate('Received', 'OfficeUpdatedEvent'),
    SUCCESS: (id: string) => logTemplate('Success', `updated office ${id}`),
    ERROR: (id: string) => logTemplate('Error', `updating office ${id}`),
  },
  OFFICE_DELETED: {
    RECEIVED: logTemplate('Received', 'OfficeDeletedEvent'),
    SUCCESS: (id: string) => logTemplate('Success', `deleted office ${id}`),
    ERROR: (id: string) => logTemplate('Error', `deleting office ${id}`),
  },
  OFFICE_RESTORED: {
    RECEIVED: logTemplate('Received', 'OfficeRestoredEvent'),
    SUCCESS: (id: string) => logTemplate('Success', `restored office ${id}`),
    ERROR: (id: string) => logTemplate('Error', `restoring office ${id}`),
  },

  DEPARTMENT_CREATED: {
    RECEIVED: logTemplate('Received', 'DepartmentCreatedEvent'),
    SUCCESS: (id: string) => logTemplate('Success', `created department ${id}`),
    ERROR: (id: string) => logTemplate('Error', `creating department ${id}`),
  },
  DEPARTMENT_UPDATED: {
    RECEIVED: logTemplate('Received', 'DepartmentUpdatedEvent'),
    SUCCESS: (id: string) => logTemplate('Success', `updated department ${id}`),
    ERROR: (id: string) => logTemplate('Error', `updating department ${id}`),
  },
  DEPARTMENT_DELETED: {
    RECEIVED: logTemplate('Received', 'DepartmentDeletedEvent'),
    SUCCESS: (id: string) => logTemplate('Success', `deleted department ${id}`),
    ERROR: (id: string) => logTemplate('Error', `deleting department ${id}`),
  },
  DEPARTMENT_RESTORED: {
    RECEIVED: logTemplate('Received', 'DepartmentRestoredEvent'),
    SUCCESS: (id: string) =>
      logTemplate('Success', `restored department ${id}`),
    ERROR: (id: string) => logTemplate('Error', `restoring department ${id}`),
  },

  ROLE_CREATED: {
    RECEIVED: logTemplate('Received', 'RoleCreatedEvent'),
    SUCCESS: (id: string) => logTemplate('Success', `created role ${id}`),
    ERROR: (id: string) => logTemplate('Error', `creating role ${id}`),
  },
  ROLE_UPDATED: {
    RECEIVED: logTemplate('Received', 'RoleUpdatedEvent'),
    SUCCESS: (id: string) => logTemplate('Success', `updated role ${id}`),
    ERROR: (id: string) => logTemplate('Error', `updating role ${id}`),
  },
  ROLE_DELETED: {
    RECEIVED: logTemplate('Received', 'RoleDeletedEvent'),
    SUCCESS: (id: string) => logTemplate('Success', `deleted role ${id}`),
    ERROR: (id: string) => logTemplate('Error', `deleting role ${id}`),
  },
  ROLE_RESTORED: {
    RECEIVED: logTemplate('Received', 'RoleRestoredEvent'),
    SUCCESS: (id: string) => logTemplate('Success', `restored role ${id}`),
    ERROR: (id: string) => logTemplate('Error', `restoring role ${id}`),
  },

  STATUS_LABEL_CREATED: {
    RECEIVED: logTemplate('Received', 'StatusLabelCreatedEvent'),
    SUCCESS: (id: string) =>
      logTemplate('Success', `created status label ${id}`),
    ERROR: (id: string) => logTemplate('Error', `creating status label ${id}`),
  },
  STATUS_LABEL_UPDATED: {
    RECEIVED: logTemplate('Received', 'StatusLabelUpdatedEvent'),
    SUCCESS: (id: string) =>
      logTemplate('Success', `updated status label ${id}`),
    ERROR: (id: string) => logTemplate('Error', `updating status label ${id}`),
  },
  STATUS_LABEL_DELETED: {
    RECEIVED: logTemplate('Received', 'StatusLabelDeletedEvent'),
    SUCCESS: (id: string) =>
      logTemplate('Success', `deleted status label ${id}`),
    ERROR: (id: string) => logTemplate('Error', `deleting status label ${id}`),
  },
  STATUS_LABEL_RESTORED: {
    RECEIVED: logTemplate('Received', 'StatusLabelRestoredEvent'),
    SUCCESS: (id: string) =>
      logTemplate('Success', `restored status label ${id}`),
    ERROR: (id: string) => logTemplate('Error', `restoring status label ${id}`),
  },

  CATEGORY_CREATED: {
    RECEIVED: logTemplate('Received', 'CategoryCreatedEvent'),
    SUCCESS: (id: string) => logTemplate('Success', `created category ${id}`),
    ERROR: (id: string) => logTemplate('Error', `creating category ${id}`),
  },
  CATEGORY_UPDATED: {
    RECEIVED: logTemplate('Received', 'CategoryUpdatedEvent'),
    SUCCESS: (id: string) => logTemplate('Success', `updated category ${id}`),
    ERROR: (id: string) => logTemplate('Error', `updating category ${id}`),
  },
  CATEGORY_DELETED: {
    RECEIVED: logTemplate('Received', 'CategoryDeletedEvent'),
    SUCCESS: (id: string) => logTemplate('Success', `deleted category ${id}`),
    ERROR: (id: string) => logTemplate('Error', `deleting category ${id}`),
  },
  CATEGORY_RESTORED: {
    RECEIVED: logTemplate('Received', 'CategoryRestoredEvent'),
    SUCCESS: (id: string) => logTemplate('Success', `restored category ${id}`),
    ERROR: (id: string) => logTemplate('Error', `restoring category ${id}`),
  },

  MANUFACTURER_CREATED: {
    RECEIVED: logTemplate('Received', 'ManufacturerCreatedEvent'),
    SUCCESS: (id: string) =>
      logTemplate('Success', `created manufacturer ${id}`),
    ERROR: (id: string) => logTemplate('Error', `creating manufacturer ${id}`),
  },
  MANUFACTURER_UPDATED: {
    RECEIVED: logTemplate('Received', 'ManufacturerUpdatedEvent'),
    SUCCESS: (id: string) =>
      logTemplate('Success', `updated manufacturer ${id}`),
    ERROR: (id: string) => logTemplate('Error', `updating manufacturer ${id}`),
  },
  MANUFACTURER_DELETED: {
    RECEIVED: logTemplate('Received', 'ManufacturerDeletedEvent'),
    SUCCESS: (id: string) =>
      logTemplate('Success', `deleted manufacturer ${id}`),
    ERROR: (id: string) => logTemplate('Error', `deleting manufacturer ${id}`),
  },
  MANUFACTURER_RESTORED: {
    RECEIVED: logTemplate('Received', 'ManufacturerRestoredEvent'),
    SUCCESS: (id: string) =>
      logTemplate('Success', `restored manufacturer ${id}`),
    ERROR: (id: string) => logTemplate('Error', `restoring manufacturer ${id}`),
  },

  ATTRIBUTE_CREATED: {
    RECEIVED: logTemplate('Received', 'AttributeCreatedEvent'),
    SUCCESS: (id: string) => logTemplate('Success', `created attribute ${id}`),
    ERROR: (id: string) => logTemplate('Error', `creating attribute ${id}`),
  },
  ATTRIBUTE_UPDATED: {
    RECEIVED: logTemplate('Received', 'AttributeUpdatedEvent'),
    SUCCESS: (id: string) => logTemplate('Success', `updated attribute ${id}`),
    ERROR: (id: string) => logTemplate('Error', `updating attribute ${id}`),
  },
  ATTRIBUTE_DELETED: {
    RECEIVED: logTemplate('Received', 'AttributeDeletedEvent'),
    SUCCESS: (id: string) => logTemplate('Success', `deleted attribute ${id}`),
    ERROR: (id: string) => logTemplate('Error', `deleting attribute ${id}`),
  },
  ATTRIBUTE_RESTORED: {
    RECEIVED: logTemplate('Received', 'AttributeRestoredEvent'),
    SUCCESS: (id: string) => logTemplate('Success', `restored attribute ${id}`),
    ERROR: (id: string) => logTemplate('Error', `restoring attribute ${id}`),
  },

  PERMISSIONS_ASSIGNED_TO_ROLE: {
    RECEIVED: logTemplate('Received', 'PermissionAssignedToRoleEvent'),
    SUCCESS: (id: string) =>
      logTemplate('Success', `assigned permission ${id} to role`),
    ERROR: (id: string) =>
      logTemplate('Error', `assigning permission ${id} to role`),
  },
};
