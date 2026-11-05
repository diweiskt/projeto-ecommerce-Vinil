import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UsersService } from '../users/users.service';
import { RegisterDto } from '../dtos/register-dto';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private usersService: UsersService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.validate(email, password);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return {
      access_token: await this.jwt.signAsync(payload),
      user: payload,
    };
  }

  async validate(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordIsValid) {
      return null;
    }

    const { passwordHash: _, ...safeUser } = user;

    return safeUser;
  }

  async register(dto: RegisterDto) {
    const user = await this.usersService.create({ ...dto, role: "CUSTOMER" });

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return {
      access_token: await this.jwt.signAsync(payload),
      user: payload,
    };
  }
}
