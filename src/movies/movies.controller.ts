import {
  Controller,
  Get,
  Query,
  UseGuards,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import * as stream from 'stream';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Get('search')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search for movies via KMDB API' })
  @ApiQuery({
    name: 'title',
    required: true,
    description: 'The title of the movie to search for.',
  })
  @ApiQuery({
    name: 'genre',
    required: false,
    description: 'The genre to filter movies by.',
  })
  @ApiQuery({
    name: 'startCount',
    required: false,
    description: 'The starting index for pagination (default: 0).',
  })
  @ApiResponse({ status: 200, description: 'Return list of movies' })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async search(
    @Query('title') title: string,
    @Query('genre') genre?: string,
    @Query('startCount') startCount?: number,
  ) {
    if (!title) {
      throw new BadRequestException('Title query parameter is required');
    }
    return this.moviesService.searchMovies(title, genre, startCount);
  }

  @Get('image')
  @ApiOperation({
    summary: 'Image Proxy',
    description: 'Fetches an image from a URL to bypass CORS issues.',
  })
  @ApiQuery({
    name: 'url',
    required: true,
    description: 'The URL of the image to fetch.',
  })
  @ApiResponse({ status: 200, description: 'Return the image binary' })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  async getImage(@Query('url') url: string, @Res() res: Response) {
    if (!url) {
      throw new BadRequestException('URL query parameter is required');
    }
    const imageStream: stream.Readable = await this.moviesService.getImage(url);
    imageStream.pipe(res);
  }
}
