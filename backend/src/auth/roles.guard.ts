import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    if (request.user?.role === 'DEMO' &&
        !['GET', 'HEAD', 'OPTIONS'].includes(String(request.method).toUpperCase())) {
      throw new ForbiddenException('Conta de demonstração: somente leitura');
    }

    if (!requiredRoles) {
      return true;
    }

    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'Acesso permitido apenas para administradores',
      );
    }

    return true;
  }
}
