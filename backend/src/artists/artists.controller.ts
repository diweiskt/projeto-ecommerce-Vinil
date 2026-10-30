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

import { CreateArtistDto } from '../dtos/create-artist-dto';
import { UpdateArtistDto } from '../dtos/update-artist-dto';
import { ArtistsService } from './artists.service';
import { Roles } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';

@Controller('artists')
export class ArtistsController {
  constructor(private artistsService: ArtistsService) {}

  @Post()
  @Roles('ADMIN')
  async create(@Body() dto: CreateArtistDto) {
    return await this.artistsService.create(dto);
  }

  @Public()
  @Get()
  async findAll() {
    return await this.artistsService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.artistsService.findOne(id);
  }

  @Put(':id')
  @Roles('ADMIN')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateArtistDto,
  ) {
    return await this.artistsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.artistsService.remove(id);
  }
}
