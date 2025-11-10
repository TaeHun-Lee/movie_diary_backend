import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import {
  KmdbApiResponse,
  KmdbMovieResult,
} from './dto/kmdb-movie-response.dto';
import * as stream from 'stream';
import { GenresService } from 'src/genres/genres.service';

@Injectable()
export class MoviesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configSrvice: ConfigService,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly genresService: GenresService,
  ) {}

  async searchMovies(
    title: string,
    genre?: string,
  ): Promise<ReturnType<typeof this._transformMovieData>[]> {
    const apiKey = this.configSrvice.get<string>('KMDB_API_KEY');
    const baseUrl = this.configSrvice.get<string>('KMDB_API_URL');
    let url = `${baseUrl}?collection=kmdb_new2&detail=Y&query=${encodeURIComponent(
      title,
    )}&ServiceKey=${apiKey}`;
    if (genre) {
      url += `&genre=${encodeURIComponent(genre)}`;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get<KmdbApiResponse>(url),
      );
      if (response.status !== 200) {
        throw new InternalServerErrorException(
          `Failed to fetch movies: ${response.statusText}`,
        );
      }
      const results = response.data?.Data?.[0]?.Result ?? [];
      const movieResults = results.map(this._transformMovieData);

      const filteredResults = genre
        ? movieResults.filter((movie) => movie.genres.includes(genre))
        : movieResults;

      return filteredResults.sort((a, b) =>
        b.releaseDate.localeCompare(a.releaseDate),
      );
    } catch (error) {
      const err = error as Error;
      throw new InternalServerErrorException(
        `Failed to fetch movies: ${err.message}`,
      );
    }
  }

  private _transformMovieData = (movie: KmdbMovieResult) => {
    return {
      docId: movie.DOCID ?? '',
      title: movie.title.replace(/!HS|!HE/g, '').trim() ?? '',
      director: movie.directors?.director?.[0]?.directorNm ?? '',
      releaseDate: movie.repRlsDate ?? '',
      poster: movie.posters?.split('|')?.[0] ?? null,
      stills: movie.stlls?.split('|') ?? [],
      plot: movie.plots?.plot?.[0]?.plotText ?? '',
      genres: movie.genre?.split(',').map((g) => g.trim()) ?? [],
    };
  };

  async getImage(url: string): Promise<stream.Readable> {
    const response = await firstValueFrom(
      this.httpService.get(url, { responseType: 'stream' }),
    );
    return response.data as stream.Readable;
  }

  async findOrCreateMovie(movieDto: CreateMovieDto): Promise<Movie> {
    const existingMovie = await this.movieRepository.findOneBy({
      docId: movieDto.docId,
    });

    if (existingMovie) {
      return existingMovie;
    }

    const { genres: genreNames, ...restOfMovieData } = movieDto;
    const genres = await this.genresService.findOrCreateGenres(genreNames ?? []);

    const newMovie = this.movieRepository.create({
      ...restOfMovieData,
      genres,
    });
    return this.movieRepository.save(newMovie);
  }

  async findMovieByDocId(docId: string): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { docId },
      relations: ['posts'],
    });

    if (!movie) {
      throw new NotFoundException(`Movie with DOCID ${docId} not found`);
    }

    return movie;
  }
}
