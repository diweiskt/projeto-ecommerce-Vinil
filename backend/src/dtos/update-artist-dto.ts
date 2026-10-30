import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateArtistDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  country?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  bio?: string;
}
