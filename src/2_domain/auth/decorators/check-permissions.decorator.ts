import { SetMetadata } from '@nestjs/common';
import { AppPermission } from '../constants/app-permissions';

export const PERMISSION_KEY = 'permission';
export const CheckPermissions = (permission: AppPermission) =>
  SetMetadata(PERMISSION_KEY, permission);
