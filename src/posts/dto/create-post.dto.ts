import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsDate,
  IsArray,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { CreateMovieDto } from '../../movies/dto/create-movie.dto';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'My review of Inception',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The content of the post',
    example: 'A mind-bending thriller...',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'The place where the movie was watched',
    example: 'Cineplex',
    required: false,
  })
  @IsOptional()
  @IsString()
  place?: string;

  @ApiProperty({
    description: 'The date when the movie was watched',
    example: '2023-10-27',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  watched_at: Date;

  @ApiProperty({
    description: 'The rating given to the movie (0-10)',
    example: 9.5,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @ApiProperty({
    description: 'Whether the review contains spoilers',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  is_spoiler?: boolean;


  @ApiProperty({
    description: 'A list of URLs for photos related to the post',
    example: ['http://example.com/photo1.jpg'],
    required: false,
  })
  @IsOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photo_urls?: string[];

  @ApiProperty({ description: 'The movie associated with the post' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateMovieDto)
  movie: CreateMovieDto;
}
