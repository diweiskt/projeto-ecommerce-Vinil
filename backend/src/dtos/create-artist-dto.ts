import { IsString, MinLength } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  @MinLength(2)
  name: string = '';

  @IsString()
  @MinLength(2)
  country: string = '';

  @IsString()
  @MinLength(3)
  bio: string = '';
}
