import { Test, TestingModule } from '@nestjs/testing';
import { LikesService } from './likes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Post } from '../posts/entities/post.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('LikesService', () => {
  let service: LikesService;
  let likeRepository: Repository<Like>;
  let postRepository: Repository<Post>;

  const mockUser = { id: 1 } as User;
  const mockPost = { id: 10, likes_count: 5 } as Post;
  const mockLike = { user_id: 1, post_id: 10 } as Like;

  const mockLikeRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockPostRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        { provide: getRepositoryToken(Like), useValue: mockLikeRepository },
        { provide: getRepositoryToken(Post), useValue: mockPostRepository },
      ],
    }).compile();

    service = module.get<LikesService>(LikesService);
    likeRepository = module.get<Repository<Like>>(getRepositoryToken(Like));
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('toggleLike', () => {
    it('should add a like if it does not exist', async () => {
      mockPostRepository.findOne.mockResolvedValue({ ...mockPost });
      mockLikeRepository.findOne.mockResolvedValue(null);
      mockLikeRepository.create.mockReturnValue(mockLike);

      const result = await service.toggleLike(mockUser, 10);

      expect(likeRepository.save).toHaveBeenCalled();
      expect(postRepository.save).toHaveBeenCalled();
      expect(result.liked).toBe(true);
      expect(result.likes_count).toBe(6);
    });

    it('should remove a like if it already exists', async () => {
      mockPostRepository.findOne.mockResolvedValue({ ...mockPost });
      mockLikeRepository.findOne.mockResolvedValue(mockLike);

      const result = await service.toggleLike(mockUser, 10);

      expect(likeRepository.remove).toHaveBeenCalledWith(mockLike);
      expect(postRepository.save).toHaveBeenCalled();
      expect(result.liked).toBe(false);
      expect(result.likes_count).toBe(4);
    });

    it('should throw NotFoundException if post does not exist', async () => {
      mockPostRepository.findOne.mockResolvedValue(null);

      await expect(service.toggleLike(mockUser, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('isLiked', () => {
    it('should return true if like exists', async () => {
      mockLikeRepository.findOne.mockResolvedValue(mockLike);
      const result = await service.isLiked(1, 10);
      expect(result).toBe(true);
    });

    it('should return false if like does not exist', async () => {
      mockLikeRepository.findOne.mockResolvedValue(null);
      const result = await service.isLiked(1, 10);
      expect(result).toBe(false);
    });
  });
});
