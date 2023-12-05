import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { EndPointPermissions } from '../common/validators/enums';
import { AuthGuard } from './auth.guard';

export function Auth(...type: EndPointPermissions[]) {
  return applyDecorators(
    SetMetadata('type', type),
    UseGuards(AuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
