import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { MoviesService } from '../movies/movies.service';
import { PostPhotosService } from '../post-photos/post-photos.service';
import { DataSource, Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

describe('PostsService', () => {
  let service: PostsService;
  let postRepository: Repository<Post>;
  let moviesService: MoviesService;

  const mockUser = { id: 1, user_id: 'testuser' } as User;
  const mockPost = { 
    id: 1, 
    title: 'Test Post', 
    user: { id: 1 },
    movie: { id: 10 } 
  } as Post;

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    getMany: jest.fn(),
    getManyAndCount: jest.fn(),
  };

  const mockPostRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    softRemove: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockMoviesService = {
    findOrCreateMovie: jest.fn(),
    findMovieByDocId: jest.fn(),
  };

  const mockPostPhotosService = {
    deletePhysicalFiles: jest.fn(),
    deleteByPostId: jest.fn(),
    createPhotos: jest.fn(),
  };

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn(() => mockQueryRunner),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useValue: mockPostRepository },
        { provide: MoviesService, useValue: mockMoviesService },
        { provide: PostPhotosService, useValue: mockPostPhotosService },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
    moviesService = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a post if found', async () => {
      const qb = mockPostRepository.createQueryBuilder();
      (qb.getOne as jest.Mock).mockResolvedValue(mockPost);

      const result = await service.findOne(1);

      expect(result).toEqual(mockPost);
    });

    it('should throw NotFoundException if post not found', async () => {
      const qb = mockPostRepository.createQueryBuilder();
      (qb.getOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new post', async () => {
      const createPostDto = {
        title: 'New Post',
        movie: { docId: 'doc1', title: 'Movie 1' },
      };
      
      mockMoviesService.findOrCreateMovie.mockResolvedValue({ id: 10 });
      mockQueryRunner.manager.save.mockResolvedValue({ id: 1 });
      
      // findOne is called after create
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPost);

      const result = await service.create(createPostDto as any, mockUser);

      expect(mockMoviesService.findOrCreateMovie).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(result).toEqual(mockPost);
    });
  });

  describe('update', () => {
    it('should update and return the post if author matches', async () => {
      mockPostRepository.findOne.mockResolvedValue(mockPost);
      mockPostRepository.save.mockResolvedValue({ ...mockPost, title: 'Updated Title' });
      jest.spyOn(service, 'findOne').mockResolvedValue({ ...mockPost, title: 'Updated Title' });

      const result = await service.update(1, { title: 'Updated Title' }, mockUser);

      expect(result.title).toBe('Updated Title');
    });

    it('should throw ForbiddenException if user is not the author', async () => {
      const otherUser = { id: 2 } as User;
      mockPostRepository.findOne.mockResolvedValue(mockPost);

      await expect(service.update(1, { title: 'Updated' }, otherUser))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should soft-remove the post if author matches', async () => {
      mockPostRepository.findOne.mockResolvedValue(mockPost);

      const result = await service.remove(1, mockUser);

      expect(postRepository.softRemove).toHaveBeenCalled();
      expect(result.message).toContain('successfully deleted');
    });

    it('should throw ForbiddenException if user is not the author', async () => {
      const otherUser = { id: 2 } as User;
      mockPostRepository.findOne.mockResolvedValue(mockPost);

      await expect(service.remove(1, otherUser))
        .rejects.toThrow(ForbiddenException);
    });
  });
});
