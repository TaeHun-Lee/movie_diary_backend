import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configSrvice: ConfigService,
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>
    ) {}

    async searchMovies(title: string): Promise<any> {
        const apiKey = this.configSrvice.get<string>('KMDB_API_KEY');
        const baseUrl = this.configSrvice.get<string>('KMDB_API_URL');
        const url = `${baseUrl}?collection=kmdb_new2&detail=Y&query=${encodeURIComponent(title)}&ServiceKey=${apiKey}`;

        try {
            const response = await firstValueFrom(
                this.httpService.get(url)
            );
            if (response.status !== 200) {
                throw new InternalServerErrorException(`Failed to fetch movies: ${response.statusText}`);
            }
            const results = response.data?.Data?.[0]?.Result ?? [];
            return results.map(this._transformMovieData).sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
        } catch (error) {
            throw new InternalServerErrorException(`Failed to fetch movies: ${error.message}`);
        }
    }

    private _transformMovieData(movie: any) {
        return {
            docId: movie.DOCID ?? '',
            title: movie.title.replace(/!HS|!HE/g, '').trim() ?? '',
            director: movie.directors?.director?.[0]?.directorNm ?? '',
            releaseDate: movie.repRlsDate ?? '',
            poster: movie.posters?.split('|')?.[0] ?? null,
            stills: movie.stlls?.split('|') ?? [],
            plot: movie.plots?.plot?.[0]?.plotText ?? '',
            genre: movie.genre ?? '',
        };
    }

    async saveOrFindMovie(movieDto: CreateMovieDto): Promise<any> {
        const existingMovie = await this.movieRepository.findOneBy({ docId: movieDto.docId });

        if (existingMovie) {
            return existingMovie;
        }

        const newMovie = this.movieRepository.create(movieDto);
        return this.movieRepository.save(newMovie);
    }

    async findMovieById(id: number): Promise<Movie> {
        const movie = await this.movieRepository.findOne({
            where: { id },
            relations: ['posts'],
        });

        if (!movie) {
            throw new Error(`Movie with ID ${id} not found`);
        }

        return movie;
    }
}
