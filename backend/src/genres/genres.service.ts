import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';
import { CreateGenreDto } from '../dtos/create-genre-dto';
import { UpdateGenreDto } from '../dtos/update-genre-dto';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateGenreDto) {
    const existingGenre = await this.prisma.genre.findUnique({
      where: {
        name: dto.name,
      },
    });

    if (existingGenre) {
      throw new ConflictException('Gênero já cadastrado');
    }

    return await this.prisma.genre.create({
      data: {
        name: dto.name,
        description: dto.description,
      },
    });
  }

  async findAll() {
    return await this.prisma.genre.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({
      where: {
        id: id,
      },
    });

    if (!genre) {
      throw new NotFoundException('Gênero não encontrado');
    }

    return genre;
  }

  async update(id: number, dto: UpdateGenreDto) {
    await this.findOne(id);

    if (dto.name) {
      const existingGenre = await this.prisma.genre.findUnique({
        where: {
          name: dto.name,
        },
      });

      if (existingGenre && existingGenre.id !== id) {
        throw new ConflictException('Gênero já cadastrado');
      }
    }

    return await this.prisma.genre.update({
      where: {
        id: id,
      },
      data: {
        name: dto.name,
        description: dto.description,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const vinylCount = await this.prisma.vinylRecord.count({
      where: {
        genreId: id,
      },
    });

    if (vinylCount > 0) {
      throw new ConflictException(
        'Não é possível remover um gênero que possui discos cadastrados',
      );
    }

    await this.prisma.genre.delete({
      where: {
        id: id,
      },
    });

    return {
      message: 'Gênero removido com sucesso',
    };
  }
}
