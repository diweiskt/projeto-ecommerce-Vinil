import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { AccountProfileController } from './account-profile.controller';

@Module({
  controllers: [ProfilesController, AccountProfileController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
