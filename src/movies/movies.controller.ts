import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @Get('search')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    async search(@Query('title') title: string) {
        if (!title) {
            throw new Error('Title query parameter is required');
        }
        return this.moviesService.searchMovies(title);
    }

    @Get('image')
    @ApiOperation({ summary: 'Image Proxy', description: 'Fetches an image from a URL to bypass CORS issues.' })
    @ApiQuery({ name: 'url', required: true, description: 'The URL of the image to fetch.' })
    async getImage(@Query('url') url: string, @Res() res: Response) {
        if (!url) {
            throw new Error('URL query parameter is required');
        }
        const imageStream = await this.moviesService.getImage(url);
        imageStream.pipe(res);
    }
}
