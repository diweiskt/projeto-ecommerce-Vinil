import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProfileDto {
  @IsInt()
  @Min(1)
  userId: number = 0;

  @IsString()
  @MinLength(3)
  fullName: string = '';

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
