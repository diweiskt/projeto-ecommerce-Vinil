import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';
import { CreateProfileDto } from '../dtos/create-profile-dto';
import { UpdateProfileDto } from '../dtos/update-profile-dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateForUser(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return this.prisma.profile.upsert({
      where: { userId },
      create: { userId, fullName: user.name },
      update: {},
    });
  }

  async saveForUser(
    userId: number,
    dto: { fullName: string; birthDate?: string; avatarUrl?: string },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    const profile = await this.prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        fullName: dto.fullName,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
        avatarUrl: dto.avatarUrl || null,
      },
      update: {
        fullName: dto.fullName,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
        avatarUrl: dto.avatarUrl || null,
      },
    });
    await this.prisma.user.update({
      where: { id: userId },
      data: { name: dto.fullName },
    });
    return profile;
  }

  async create(dto: CreateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: dto.userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const existingProfile = await this.prisma.profile.findUnique({
      where: {
        userId: dto.userId,
      },
    });

    if (existingProfile) {
      throw new ConflictException('Usuário já possui um perfil');
    }

    return await this.prisma.profile.create({
      data: {
        userId: dto.userId,
        fullName: dto.fullName,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
        avatarUrl: dto.avatarUrl,
      },
    });
  }

  async findAll() {
    return await this.prisma.profile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    return profile;
  }

  async update(id: number, dto: UpdateProfileDto) {
    await this.findOne(id);

    return await this.prisma.profile.update({
      where: {
        id: id,
      },
      data: {
        fullName: dto.fullName,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        avatarUrl: dto.avatarUrl,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.profile.delete({
      where: {
        id: id,
      },
    });

    return {
      message: 'Perfil removido com sucesso',
    };
  }
}
