import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';
import { CreateVinylRecordDto } from '../dtos/create-vinyl-record-dto';
import { UpdateVinylRecordDto } from '../dtos/update-vinyl-record-dto';
import { FilterVinylRecordsDto } from '../dtos/filter-vinyl-records-dto';

@Injectable()
export class VinylRecordsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVinylRecordDto) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id: dto.artistId,
      },
    });

    if (!artist) {
      throw new NotFoundException('Artista não encontrado');
    }

    const genre = await this.prisma.genre.findUnique({
      where: {
        id: dto.genreId,
      },
    });

    if (!genre) {
      throw new NotFoundException('Gênero não encontrado');
    }

    return await this.prisma.vinylRecord.create({
      data: {
        title: dto.title,
        releaseYear: dto.releaseYear,
        price: dto.price,
        condition: dto.condition,
        rpmSpeed: dto.rpmSpeed,
        stockQuantity: dto.stockQuantity,
        artistId: dto.artistId,
        genreId: dto.genreId,
        coverUrl: dto.coverUrl,
      },

      include: {
        artist: true,
        genre: true,
      },
    });
  }

  async findAll(filters: FilterVinylRecordsDto) {
    return await this.prisma.vinylRecord.findMany({
      where: {
        title: filters.title
          ? {
              contains: filters.title,
            }
          : undefined,

        releaseYear: filters.releaseYear,

        artistId: filters.artistId,

        genreId: filters.genreId,

        rpmSpeed: filters.rpmSpeed,

        condition: filters.condition
          ? {
              contains: filters.condition,
            }
          : undefined,

        price:
          filters.minPrice !== undefined || filters.maxPrice !== undefined
            ? {
                gte: filters.minPrice,
                lte: filters.maxPrice,
              }
            : undefined,

        stockQuantity:
          filters.inStock === 'true'
            ? {
                gt: 0,
              }
            : filters.inStock === 'false'
              ? {
                  equals: 0,
                }
              : undefined,
      },

      include: {
        artist: true,
        genre: true,
      },

      orderBy: {
        title: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const vinylRecord = await this.prisma.vinylRecord.findUnique({
      where: {
        id: id,
      },

      include: {
        artist: true,
        genre: true,
      },
    });

    if (!vinylRecord) {
      throw new NotFoundException('Disco de vinil não encontrado');
    }

    return vinylRecord;
  }

  async update(id: number, dto: UpdateVinylRecordDto) {
    await this.findOne(id);

    if (dto.artistId !== undefined) {
      const artist = await this.prisma.artist.findUnique({
        where: {
          id: dto.artistId,
        },
      });

      if (!artist) {
        throw new NotFoundException('Artista não encontrado');
      }
    }

    if (dto.genreId !== undefined) {
      const genre = await this.prisma.genre.findUnique({
        where: {
          id: dto.genreId,
        },
      });

      if (!genre) {
        throw new NotFoundException('Gênero não encontrado');
      }
    }

    return await this.prisma.vinylRecord.update({
      where: {
        id: id,
      },

      data: {
        title: dto.title,
        releaseYear: dto.releaseYear,
        price: dto.price,
        condition: dto.condition,
        rpmSpeed: dto.rpmSpeed,
        stockQuantity: dto.stockQuantity,
        artistId: dto.artistId,
        genreId: dto.genreId,
        coverUrl: dto.coverUrl,
      },

      include: {
        artist: true,
        genre: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.vinylRecord.delete({
      where: {
        id: id,
      },
    });

    return {
      message: 'Disco de vinil removido com sucesso',
    };
  }
}
