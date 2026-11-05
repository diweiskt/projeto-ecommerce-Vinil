import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../database/prisma.service';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

    const authorization = String(request.headers?.authorization || '');

    if (!authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Bearer token ausente');
    }

    const token = authorization.slice(7).trim();

    try {
      const payload = this.jwt.verify(token, { algorithms: ['HS256'] });
      if (!Number.isInteger(payload.sub) || payload.sub <= 0 ||
          !Number.isFinite(payload.exp)) {
        throw new UnauthorizedException();
      }
      // Permissões atuais: exclusão ou mudança de papel vale imediatamente.
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, name: true, email: true, role: true },
      });
      if (!user) throw new UnauthorizedException();
      request.user = { sub: user.id, name: user.name, email: user.email, role: user.role };

      return true;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
