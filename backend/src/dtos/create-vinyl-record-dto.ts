import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateVinylRecordDto {
  @IsString()
  @MinLength(2)
  title: string = '';

  @IsInt()
  @Min(1900)
  releaseYear: number = 0;

  @IsNumber()
  @Min(0.01)
  price: number = 0;

  @IsString()
  @MinLength(2)
  condition: string = '';

  @IsInt()
  @IsIn([33, 45, 78])
  rpmSpeed: number = 33;

  @IsInt()
  @Min(0)
  stockQuantity: number = 0;

  @IsInt()
  @Min(1)
  artistId: number = 0;

  @IsInt()
  @Min(1)
  genreId: number = 0;

  @IsOptional()
  @IsString()
  coverUrl?: string;
}
