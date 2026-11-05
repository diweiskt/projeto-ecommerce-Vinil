import { Body, Controller, Post, Get, Req } from '@nestjs/common';

import { Throttle } from '@nestjs/throttler';
import { Public } from './public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from '../dtos/login-dto';
import { RegisterDto } from '../dtos/register-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('me')
  me(@Req() req: { user: { sub: number; email: string; name: string; role: string } }) {
    return req.user;
  }

  @Public()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto.email, dto.password);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }
}
