import { Body, Controller, Post, Get, Req } from "@nestjs/common";

import { Throttle } from "@nestjs/throttler";
import { Public } from "./public.decorator";
import { AuthService } from "./auth.service";
import { LoginDto } from "../dtos/login-dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("me")
  me(
    @Req()
    req: {
      user: { sub: number; email: string; name: string; role: string };
    },
  ) {
    return req.user;
  }

  @Public()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Post("login")
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto.email, dto.password);
  }
}
