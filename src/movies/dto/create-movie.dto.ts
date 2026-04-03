import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({
    description: 'The unique document ID from KMDB',
    example: 'K12345',
  })
  @IsString()
  docId: string;

  @ApiProperty({
    description: 'The title of the movie',
    example: 'Inception',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'The director of the movie',
    example: 'Christopher Nolan',
  })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiPropertyOptional({
    description: 'The release date of the movie',
    example: '2010-07-16',
  })
  @IsOptional()
  @IsString()
  releaseDate?: string;

  @ApiPropertyOptional({
    description: 'The URL of the movie poster',
    example: 'https://example.com/poster.jpg',
  })
  @IsOptional()
  @IsString()
  poster?: string;

  @ApiPropertyOptional({
    description: 'The list of URLs for movie stills',
    example: ['https://example.com/still1.jpg', 'https://example.com/still2.jpg'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  stills?: string[];

  @ApiPropertyOptional({
    description: 'The plot summary of the movie',
    example: 'A thief who steals corporate secrets through the use of dream-sharing technology...',
  })
  @IsOptional()
  @IsString()
  plot?: string;

  @ApiPropertyOptional({
    description: 'The list of genres for the movie',
    example: ['Action', 'Sci-Fi'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  genres?: string[];
}
