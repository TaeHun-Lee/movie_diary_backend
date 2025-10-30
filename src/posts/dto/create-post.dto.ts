import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateMovieDto } from '../../movies/dto/create-movie.dto';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  place?: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  watched_at: Date;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  photo_urls?: string[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateMovieDto)
  movie: CreateMovieDto;
}
