import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';

import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AuthModule } from './auth/auth.module';
import { ArtistsModule } from './artists/artists.module';
import { GenresModule } from './genres/genres.module';
import { VinylRecordsModule } from './vinyl-records/vinyl-records.module';

@Module({
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env: Record<string, unknown>) => {
        const secret = String(env.JWT_SECRET || '');
        if (secret.length < 64 || /substitua|dev-secret/i.test(secret)) {
          throw new Error('Configure JWT_SECRET com uma chave aleatória de pelo menos 64 caracteres.');
        }
        if (env.NODE_ENV === 'production' && !env.CORS_ORIGINS) {
          throw new Error('Configure CORS_ORIGINS em produção.');
        }
        return env;
      },
    }),

    ThrottlerModule.forRoot([{ ttl: 60000, limit: 120 }]),
    DatabaseModule,

    AuthModule,
    UsersModule,
    ProfilesModule,
    ArtistsModule,
    GenresModule,
    VinylRecordsModule,
  ],
})
export class AppModule {}
