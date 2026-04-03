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
import { GenresService } from '../genres/genres.service';

@Injectable()
export class MoviesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configSrvice: ConfigService,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly genresService: GenresService,
  ) { }

  async searchMovies(
    title: string,
    genre?: string,
    startCount?: number,
  ): Promise<ReturnType<typeof this._transformMovieData>[]> {
    const apiKey = this.configSrvice.get<string>('KMDB_API_KEY');
    const baseUrl = this.configSrvice.get<string>('KMDB_API_URL');
    let url = `${baseUrl}?collection=kmdb_new2&detail=Y&query=${encodeURIComponent(
      title,
    )}&ServiceKey=${apiKey}&listCount=100&startCount=${startCount ?? 0}`;
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

      return filteredResults.sort((a, b) => {
        const query = title.replace(/\s+/g, '').toLowerCase();
        const titleA = a.title.replace(/\s+/g, '').toLowerCase();
        const titleB = b.title.replace(/\s+/g, '').toLowerCase();

        // 1. Exact Match
        const exactA = titleA === query;
        const exactB = titleB === query;
        if (exactA && !exactB) return -1;
        if (!exactA && exactB) return 1;

        // 2. Starts With
        const startA = titleA.startsWith(query);
        const startB = titleB.startsWith(query);
        if (startA && !startB) return -1;
        if (!startA && startB) return 1;

        // 3. Contains
        const containsA = titleA.includes(query);
        const containsB = titleB.includes(query);
        if (containsA && !containsB) return -1;
        if (!containsA && containsB) return 1;

        // 4. Release Date (Desc)
        return b.releaseDate.localeCompare(a.releaseDate);
      });
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

  private parseReleaseDate(value?: string): Date | undefined {
    if (!value) {
      return undefined;
    }

    const valueTrimmed = value.trim();
    if (!valueTrimmed) {
      return undefined;
    }

    const normalized = /^\d{8}$/.test(valueTrimmed)
      ? `${valueTrimmed.slice(0, 4)}-${valueTrimmed.slice(4, 6)}-${valueTrimmed.slice(6, 8)}`
      : valueTrimmed;

    const parsed = new Date(normalized);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }

  async getImage(url: string): Promise<stream.Readable> {
    const response = await firstValueFrom(
      this.httpService.get(url, { responseType: 'stream' }),
    );
    return response.data as stream.Readable;
  }

  async findOrCreateMovie(movieDto: CreateMovieDto): Promise<Movie> {
    const existingMovie = await this.movieRepository.findOne({
      where: { docId: movieDto.docId },
      relations: ['genres'],
    });

    const { genres: genreNames, releaseDate, poster, ...restOfMovieData } = movieDto;
    const genres = await this.genresService.findOrCreateGenres(
      genreNames ?? [],
    );

    const movieDataToSave = {
      ...restOfMovieData,
      release_date: this.parseReleaseDate(releaseDate),
      poster: poster,
    };
    if (existingMovie) {
      // Update existing movie with latest data
      Object.assign(existingMovie, movieDataToSave);
      existingMovie.genres = genres;
      return this.movieRepository.save(existingMovie);
    }

    const newMovie = this.movieRepository.create({
      ...movieDataToSave,
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
