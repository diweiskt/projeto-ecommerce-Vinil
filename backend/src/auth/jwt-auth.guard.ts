import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // Libera requisições CORS de verificação
    const method = String(request.method || '').toUpperCase();

    if (method === 'OPTIONS') {
      return true;
    }

    const url = String(request.originalUrl || request.url || '');

    // Login e registro precisam ser públicos
    if (url.includes('/auth/login') || url.includes('/auth/register')) {
      return true;
    }

    const authorization = String(request.headers?.authorization || '');

    if (!authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Bearer token ausente');
    }

    const token = authorization.slice(7).trim();

    try {
      request.user = this.jwt.verify(token);

      return true;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
