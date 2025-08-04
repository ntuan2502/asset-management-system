import { ACTIONS } from './actions';
import { SUBJECTS } from './subjects';

// Định nghĩa một kiểu cho tiện
export type AppPermission = {
  action: string;
  subject: string;
};

// Đây là nguồn chân lý (source of truth) cho tất cả các quyền trong hệ thống
export const ALL_APP_PERMISSIONS: AppPermission[] = [
  // Quyền trên User
  { action: ACTIONS.CREATE, subject: SUBJECTS.USER },
  { action: ACTIONS.READ, subject: SUBJECTS.USER },
  { action: ACTIONS.UPDATE, subject: SUBJECTS.USER },
  { action: ACTIONS.DELETE, subject: SUBJECTS.USER },

  // Quyền trên Role
  { action: ACTIONS.CREATE, subject: SUBJECTS.ROLE },
  { action: ACTIONS.READ, subject: SUBJECTS.ROLE },
  { action: ACTIONS.UPDATE, subject: SUBJECTS.ROLE }, // Ví dụ: gán/gỡ quyền
  { action: ACTIONS.DELETE, subject: SUBJECTS.ROLE },

  // Bạn có thể thêm các quyền khác ở đây khi ứng dụng phát triển
  // Ví dụ:
  // { action: ACTIONS.CREATE, subject: SUBJECTS.ASSET },
];
