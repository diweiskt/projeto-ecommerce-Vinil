import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

import { CreateProfileDto } from '../dtos/create-profile-dto';
import { UpdateProfileDto } from '../dtos/update-profile-dto';
import { Roles } from '../auth/roles.decorator';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
@Roles('ADMIN')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Post()
  async create(@Body() dto: CreateProfileDto) {
    return await this.profilesService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.profilesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.profilesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProfileDto,
  ) {
    return await this.profilesService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.profilesService.remove(id);
  }
}
