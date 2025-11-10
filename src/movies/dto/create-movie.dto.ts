import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  docId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  director?: string;

  @IsOptional()
  @IsString()
  releaseDate?: string;

  @IsOptional()
  @IsString()
  poster?: string;

  @IsOptional()
  @IsArray()
  stills?: string[];

  @IsOptional()
  @IsString()
  plot?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  genres?: string[];
}
