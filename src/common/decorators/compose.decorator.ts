import {Permission} from "@/common/enums/permission";
import {PermissionGuard} from "@/common/guards/permission.guard";
import {applyDecorators, Query, SetMetadata, UseGuards} from "@nestjs/common";

export function ComposedDecorator(...permissions: Permission[]) {
  return applyDecorators(
    SetMetadata('permissions', permissions),
    // UseGuards(PermissionGuard),
    // Query('permissions'),
    // ApiBearerAuth(),
    // ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

// @Get('users')
// @ComposedDecorator('create')
// findAllUsers() {}
