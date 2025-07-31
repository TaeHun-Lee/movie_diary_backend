import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('movies')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @Get('search')
    async search(@Query('title') title: string) {
        if (!title) {
            throw new Error('Title query parameter is required');
        }
        return this.moviesService.searchMovies(title);
    }
}
