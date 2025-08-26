import { ACTIONS } from './actions';
import { ENTITY_SUBJECTS } from './subjects';

export type AppPermission = {
  action: string;
  subject: string;
};

export const ALL_APP_PERMISSIONS: AppPermission[] = [
  // Thêm quyền cho Permission (chỉ đọc)
  { action: ACTIONS.READ, subject: ENTITY_SUBJECTS.PERMISSION },

  // Quyền trên User
  { action: ACTIONS.CREATE, subject: ENTITY_SUBJECTS.USER },
  { action: ACTIONS.READ, subject: ENTITY_SUBJECTS.USER },
  { action: ACTIONS.UPDATE, subject: ENTITY_SUBJECTS.USER },
  { action: ACTIONS.DELETE, subject: ENTITY_SUBJECTS.USER },
  { action: ACTIONS.RESTORE, subject: ENTITY_SUBJECTS.USER },

  // Quyền trên Role
  { action: ACTIONS.CREATE, subject: ENTITY_SUBJECTS.ROLE },
  { action: ACTIONS.READ, subject: ENTITY_SUBJECTS.ROLE },
  { action: ACTIONS.UPDATE, subject: ENTITY_SUBJECTS.ROLE },
  { action: ACTIONS.DELETE, subject: ENTITY_SUBJECTS.ROLE },
  { action: ACTIONS.RESTORE, subject: ENTITY_SUBJECTS.ROLE },

  // Quyền trên Office
  { action: ACTIONS.CREATE, subject: ENTITY_SUBJECTS.OFFICE },
  { action: ACTIONS.READ, subject: ENTITY_SUBJECTS.OFFICE },
  { action: ACTIONS.UPDATE, subject: ENTITY_SUBJECTS.OFFICE },
  { action: ACTIONS.DELETE, subject: ENTITY_SUBJECTS.OFFICE },
  { action: ACTIONS.RESTORE, subject: ENTITY_SUBJECTS.OFFICE },

  // Quyền trên Department
  { action: ACTIONS.CREATE, subject: ENTITY_SUBJECTS.DEPARTMENT },
  { action: ACTIONS.READ, subject: ENTITY_SUBJECTS.DEPARTMENT },
  { action: ACTIONS.UPDATE, subject: ENTITY_SUBJECTS.DEPARTMENT },
  { action: ACTIONS.DELETE, subject: ENTITY_SUBJECTS.DEPARTMENT },
  { action: ACTIONS.RESTORE, subject: ENTITY_SUBJECTS.DEPARTMENT },

  // Quyền trên StatusLabel
  { action: ACTIONS.CREATE, subject: ENTITY_SUBJECTS.STATUS_LABEL },
  { action: ACTIONS.READ, subject: ENTITY_SUBJECTS.STATUS_LABEL },
  { action: ACTIONS.UPDATE, subject: ENTITY_SUBJECTS.STATUS_LABEL },
  { action: ACTIONS.DELETE, subject: ENTITY_SUBJECTS.STATUS_LABEL },
  { action: ACTIONS.RESTORE, subject: ENTITY_SUBJECTS.STATUS_LABEL },

  // Quyền trên Category
  { action: ACTIONS.CREATE, subject: ENTITY_SUBJECTS.CATEGORY },
  { action: ACTIONS.READ, subject: ENTITY_SUBJECTS.CATEGORY },
  { action: ACTIONS.UPDATE, subject: ENTITY_SUBJECTS.CATEGORY },
  { action: ACTIONS.DELETE, subject: ENTITY_SUBJECTS.CATEGORY },
  { action: ACTIONS.RESTORE, subject: ENTITY_SUBJECTS.CATEGORY },

  // Quyền trên Manufacturer
  { action: ACTIONS.CREATE, subject: ENTITY_SUBJECTS.MANUFACTURER },
  { action: ACTIONS.READ, subject: ENTITY_SUBJECTS.MANUFACTURER },
  { action: ACTIONS.UPDATE, subject: ENTITY_SUBJECTS.MANUFACTURER },
  { action: ACTIONS.DELETE, subject: ENTITY_SUBJECTS.MANUFACTURER },
  { action: ACTIONS.RESTORE, subject: ENTITY_SUBJECTS.MANUFACTURER },

  // Quyền trên Attribute
  { action: ACTIONS.CREATE, subject: ENTITY_SUBJECTS.ATTRIBUTE },
  { action: ACTIONS.READ, subject: ENTITY_SUBJECTS.ATTRIBUTE },
  { action: ACTIONS.UPDATE, subject: ENTITY_SUBJECTS.ATTRIBUTE },
  { action: ACTIONS.DELETE, subject: ENTITY_SUBJECTS.ATTRIBUTE },
  { action: ACTIONS.RESTORE, subject: ENTITY_SUBJECTS.ATTRIBUTE },

  // Quyền trên Product
  { action: ACTIONS.CREATE, subject: ENTITY_SUBJECTS.PRODUCT },
  { action: ACTIONS.READ, subject: ENTITY_SUBJECTS.PRODUCT },
  { action: ACTIONS.UPDATE, subject: ENTITY_SUBJECTS.PRODUCT },
  { action: ACTIONS.DELETE, subject: ENTITY_SUBJECTS.PRODUCT },
  { action: ACTIONS.RESTORE, subject: ENTITY_SUBJECTS.PRODUCT },
];
