import {Permission} from "@/enums/permission";
import {PermissionGuard} from "@/guards/permission.guard";
import {applyDecorators, SetMetadata, UseGuards} from "@nestjs/common";

export function ComposedDecorator(...permissions: Permission[]) {
  return applyDecorators(
    SetMetadata('permissions', permissions),
    UseGuards(PermissionGuard),
    // ApiBearerAuth(),
    // ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

// @Get('users')
// @ComposedDecorator('create')

