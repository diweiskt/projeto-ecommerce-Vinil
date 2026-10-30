import { IsString, MinLength } from 'class-validator';

export class CreateGenreDto {
  @IsString()
  @MinLength(2)
  name: string = '';

  @IsString()
  @MinLength(3)
  description: string = '';
}
