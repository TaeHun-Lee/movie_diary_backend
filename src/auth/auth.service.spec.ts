import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    user_id: 'testuser',
    password: 'hashedPassword',
    nickname: 'TestNick',
    security_question: 'Question?',
    security_answer: 'hashedAnswer',
    hashed_refresh_token: 'hashedRefreshToken',
  } as User;

  const mockUsersService = {
    create: jest.fn(),
    findByUserId: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and return tokens', async () => {
      const registerDto = {
        user_id: 'newuser',
        password: 'password123',
        nickname: 'NewNick',
        security_question: 'Q',
        security_answer: 'A',
      };
      
      mockUsersService.create.mockResolvedValue(mockUser);
      jest.spyOn(service, 'getTokens').mockResolvedValue({
        access_token: 'access',
        refresh_token: 'refresh',
      });

      const result = await service.register(registerDto);

      expect(usersService.create).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual({ access_token: 'access', refresh_token: 'refresh' });
    });
  });

  describe('login', () => {
    const loginDto = { user_id: 'testuser', password: 'password123' };

    it('should return tokens for valid credentials', async () => {
      mockUsersService.findByUserId.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(service, 'getTokens').mockResolvedValue({
        access_token: 'access',
        refresh_token: 'refresh',
      });

      const result = await service.login(loginDto);

      expect(result).toEqual({ access_token: 'access', refresh_token: 'refresh' });
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      mockUsersService.findByUserId.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findByUserId.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    it('should return new tokens if refresh token matches', async () => {
      mockUsersService.findById.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(service, 'getTokens').mockResolvedValue({
        access_token: 'new_access',
        refresh_token: 'new_refresh',
      });

      const result = await service.refresh(1, 'valid_refresh_token');

      expect(result).toEqual({ access_token: 'new_access', refresh_token: 'new_refresh' });
    });

    it('should throw ForbiddenException if refresh token does not match', async () => {
      mockUsersService.findById.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      await expect(service.refresh(1, 'invalid_token')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('resetPassword', () => {
    it('should reset password if security answer is correct', async () => {
      mockUsersService.findByUserId.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const result = await service.resetPassword('testuser', 'correctAnswer', 'newPass');

      expect(usersService.update).toHaveBeenCalled();
      expect(result.message).toBe('Password reset successfully');
    });

    it('should throw UnauthorizedException if answer is incorrect', async () => {
      mockUsersService.findByUserId.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      await expect(service.resetPassword('testuser', 'wrongAnswer', 'newPass'))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});
