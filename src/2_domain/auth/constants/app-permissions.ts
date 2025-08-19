import { ACTIONS } from './actions';
import { SUBJECTS } from './subjects';

export type AppPermission = {
  action: string;
  subject: string;
};

export const ALL_APP_PERMISSIONS: AppPermission[] = [
  // Thêm quyền cho Permission (chỉ đọc)
  { action: ACTIONS.READ, subject: SUBJECTS.PERMISSION },

  // Quyền trên User
  { action: ACTIONS.CREATE, subject: SUBJECTS.USER },
  { action: ACTIONS.READ, subject: SUBJECTS.USER },
  { action: ACTIONS.UPDATE, subject: SUBJECTS.USER },
  { action: ACTIONS.DELETE, subject: SUBJECTS.USER },

  // Quyền trên Role
  { action: ACTIONS.CREATE, subject: SUBJECTS.ROLE },
  { action: ACTIONS.READ, subject: SUBJECTS.ROLE },
  { action: ACTIONS.UPDATE, subject: SUBJECTS.ROLE },
  { action: ACTIONS.DELETE, subject: SUBJECTS.ROLE },

  // Quyền trên Office
  { action: ACTIONS.CREATE, subject: SUBJECTS.OFFICE },
  { action: ACTIONS.READ, subject: SUBJECTS.OFFICE },
  { action: ACTIONS.UPDATE, subject: SUBJECTS.OFFICE },
  { action: ACTIONS.DELETE, subject: SUBJECTS.OFFICE },

  // Quyền trên Department
  { action: ACTIONS.CREATE, subject: SUBJECTS.DEPARTMENT },
  { action: ACTIONS.READ, subject: SUBJECTS.DEPARTMENT },
  { action: ACTIONS.UPDATE, subject: SUBJECTS.DEPARTMENT },
  { action: ACTIONS.DELETE, subject: SUBJECTS.DEPARTMENT },

  // Quyền trên StatusLabel
  { action: ACTIONS.CREATE, subject: SUBJECTS.STATUS_LABEL },
  { action: ACTIONS.READ, subject: SUBJECTS.STATUS_LABEL },
  { action: ACTIONS.UPDATE, subject: SUBJECTS.STATUS_LABEL },
  { action: ACTIONS.DELETE, subject: SUBJECTS.STATUS_LABEL },

  // Quyền trên Category
  { action: ACTIONS.CREATE, subject: SUBJECTS.CATEGORY },
  { action: ACTIONS.READ, subject: SUBJECTS.CATEGORY },
  { action: ACTIONS.UPDATE, subject: SUBJECTS.CATEGORY },
  { action: ACTIONS.DELETE, subject: SUBJECTS.CATEGORY },
];
