import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';
import { ProfilesService } from './profiles.service';

class SaveOwnProfileDto {
  @IsString() @MinLength(3) fullName: string = '';
  @IsOptional() @IsDateString() birthDate?: string;
  @IsOptional() @IsString() avatarUrl?: string;
}

@Controller('account-profile')
export class AccountProfileController {
  constructor(private profilesService: ProfilesService) {}

  @Get()
  async getMine(@Req() req: Request & { user?: { sub?: number } }) {
    return this.profilesService.getOrCreateForUser(Number(req.user?.sub));
  }

  @Put()
  async updateMine(@Req() req: Request & { user?: { sub?: number } }, @Body() dto: SaveOwnProfileDto) {
    return this.profilesService.saveForUser(Number(req.user?.sub), dto);
  }
}
