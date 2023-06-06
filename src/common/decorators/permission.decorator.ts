import { Permission } from '@/common/enums/permission';
import { SetMetadata } from '@nestjs/common';
import { PERMISSION_KEY } from '../consts/permission.const';

/**
 * 权限装饰器
 * 定义接口权限
 * 可在 controller 绑定 @Permissions('xxx1', 'xxx2')
 * 然后在 PermissionGuard 里通过 reflector 拿到 请求绑定的权限标识 xxx1 xxx2
 */
export function Permissions(...permissions: Permission[]) {
  return SetMetadata(PERMISSION_KEY, permissions);
}
