import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';
import { CreateArtistDto } from '../dtos/create-artist-dto';
import { UpdateArtistDto } from '../dtos/update-artist-dto';

@Injectable()
export class ArtistsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateArtistDto) {
    return await this.prisma.artist.create({
      data: {
        name: dto.name,
        country: dto.country,
        bio: dto.bio,
      },
    });
  }

  async findAll() {
    return await this.prisma.artist.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id: id,
      },
    });

    if (!artist) {
      throw new NotFoundException('Artista não encontrado');
    }

    return artist;
  }

  async update(id: number, dto: UpdateArtistDto) {
    await this.findOne(id);

    return await this.prisma.artist.update({
      where: {
        id: id,
      },
      data: {
        name: dto.name,
        country: dto.country,
        bio: dto.bio,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const vinylCount = await this.prisma.vinylRecord.count({
      where: {
        artistId: id,
      },
    });

    if (vinylCount > 0) {
      throw new ConflictException(
        'Não é possível remover um artista que possui discos cadastrados',
      );
    }

    await this.prisma.artist.delete({
      where: {
        id: id,
      },
    });

    return {
      message: 'Artista removido com sucesso',
    };
  }
}
