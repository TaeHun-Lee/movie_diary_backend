import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('CommentsService', () => {
  let service: CommentsService;
  let commentRepository: Repository<Comment>;

  const mockUser = { id: 1 } as User;
  const mockComment = { id: 1, content: 'Test Comment', user_id: 1, post_id: 10 } as Comment;

  const mockCommentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: getRepositoryToken(Comment), useValue: mockCommentRepository },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    commentRepository = module.get<Repository<Comment>>(getRepositoryToken(Comment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new comment with user relation', async () => {
      const createDto = { content: 'New Comment', post_id: 10 };
      const commentWithUser = {
        ...mockComment,
        user: { id: 1, nickname: 'Tester', profile_image: '' } as Partial<User>,
      } as unknown as Comment;

      mockCommentRepository.create.mockReturnValue(mockComment);
      mockCommentRepository.save.mockResolvedValue(mockComment);
      mockCommentRepository.findOne.mockResolvedValue(commentWithUser);

      const result = await service.create(mockUser, createDto as any);

      expect(commentRepository.create).toHaveBeenCalled();
      expect(commentRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockComment.id },
        relations: ['user'],
      });
      expect(result).toEqual(commentWithUser);
    });
  });

  describe('update', () => {
    it('should update the comment if author matches', async () => {
      mockCommentRepository.findOne.mockResolvedValue(mockComment);
      mockCommentRepository.save.mockResolvedValue({ ...mockComment, content: 'Updated' });

      const result = await service.update(1, mockUser, { content: 'Updated' });

      expect(result.content).toBe('Updated');
    });

    it('should throw ForbiddenException if user is not the author', async () => {
      const otherUser = { id: 2 } as User;
      mockCommentRepository.findOne.mockResolvedValue(mockComment);

      await expect(service.update(1, otherUser, { content: 'Updated' }))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove the comment if author matches', async () => {
      mockCommentRepository.findOne.mockResolvedValue(mockComment);

      const result = await service.remove(1, mockUser);

      expect(commentRepository.remove).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('should throw NotFoundException if comment not found', async () => {
      mockCommentRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999, mockUser)).rejects.toThrow(NotFoundException);
    });
  });
});
