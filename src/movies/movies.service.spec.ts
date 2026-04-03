import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { GenresService } from '../genres/genres.service';
import { Repository } from 'typeorm';
import { of } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;
  let movieRepository: Repository<Movie>;
  let httpService: HttpService;

  const mockMovie = {
    id: 1,
    docId: 'testDocId',
    title: 'Test Movie',
  } as Movie;

  const mockMovieRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'KMDB_API_KEY') return 'test_key';
      if (key === 'KMDB_API_URL') return 'http://test-kmdb.com';
      return null;
    }),
  };

  const mockGenresService = {
    findOrCreateGenres: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: getRepositoryToken(Movie), useValue: mockMovieRepository },
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: GenresService, useValue: mockGenresService },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    movieRepository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchMovies', () => {
    it('should fetch and transform movies from KMDB', async () => {
      const mockApiResponse = {
        status: 200,
        data: {
          Data: [{
            Result: [{
              DOCID: 'DOC1',
              title: 'Movie Title',
              directors: { director: [{ directorNm: 'Director 1' }] },
              repRlsDate: '20230101',
              posters: 'poster.jpg',
              stlls: 'still.jpg',
              plots: { plot: [{ plotText: 'Plot text' }] },
              genre: 'Action,Drama',
            }],
          }],
        },
      };
      mockHttpService.get.mockReturnValue(of(mockApiResponse));

      const result = await service.searchMovies('Movie Title');

      expect(httpService.get).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].docId).toBe('DOC1');
      expect(result[0].title).toBe('Movie Title');
    });
  });

  describe('findOrCreateMovie', () => {
    const movieDto = {
      docId: 'testDocId',
      title: 'Test Movie',
      genres: ['Action'],
    };

    it('should return existing movie if found', async () => {
      mockMovieRepository.findOne.mockResolvedValue(mockMovie);
      mockGenresService.findOrCreateGenres.mockResolvedValue([]);
      mockMovieRepository.save.mockResolvedValue(mockMovie);

      const result = await service.findOrCreateMovie(movieDto as any);

      expect(movieRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockMovie);
    });

    it('should create and return a new movie if not found', async () => {
      mockMovieRepository.findOne.mockResolvedValue(null);
      mockGenresService.findOrCreateGenres.mockResolvedValue([]);
      mockMovieRepository.create.mockReturnValue(mockMovie);
      mockMovieRepository.save.mockResolvedValue(mockMovie);

      const result = await service.findOrCreateMovie(movieDto as any);

      expect(movieRepository.create).toHaveBeenCalled();
      expect(result).toEqual(mockMovie);
    });

    it('should normalize YYYYMMDD releaseDate before saving', async () => {
      mockMovieRepository.findOne.mockResolvedValue(null);
      mockGenresService.findOrCreateGenres.mockResolvedValue([]);
      mockMovieRepository.create.mockImplementation((payload) => payload);
      mockMovieRepository.save.mockImplementation(async (payload) => payload);

      await service.findOrCreateMovie({
        ...movieDto,
        releaseDate: '20230101',
      } as any);

      expect(movieRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          release_date: new Date('2023-01-01'),
        }),
      );
    });
  });

  describe('findMovieByDocId', () => {
    it('should return a movie if found', async () => {
      mockMovieRepository.findOne.mockResolvedValue(mockMovie);

      const result = await service.findMovieByDocId('testDocId');

      expect(result).toEqual(mockMovie);
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockMovieRepository.findOne.mockResolvedValue(null);

      await expect(service.findMovieByDocId('unknown'))
        .rejects.toThrow(NotFoundException);
    });
  });
});
