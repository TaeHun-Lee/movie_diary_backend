import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    return this.getTokens(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByUserId(loginDto.user_id);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return this.getTokens(user);
  }

  async logout(userId: number) {
    await this.usersService.update(userId, { hashed_refresh_token: null });
  }

  async refreshByToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      return this.refresh(payload.sub, refreshToken);
    } catch (e) {
      throw new ForbiddenException('Invalid Refresh Token');
    }
  }

  async refresh(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.hashed_refresh_token) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    return this.getTokens(user);
  }

  async getTokens(user: User) {
    const payload = {
      sub: user.id,
      user_id: user.user_id,
      nickname: user.nickname,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
    ]);

    // Save hashed refresh token to DB
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(user.id, {
      hashed_refresh_token: hashedRefreshToken,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async getSecurityQuestion(userId: string) {
    const user = await this.usersService.findByUserId(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!user.security_question) {
      throw new UnauthorizedException('No security question set for this user');
    }
    return { question: user.security_question };
  }

  async resetPassword(userId: string, securityAnswer: string, newPassword: string) {
    const user = await this.usersService.findByUserId(userId);
    if (!user) throw new UnauthorizedException('User not found');

    const isAnswerMatch = await bcrypt.compare(
      securityAnswer,
      user.security_answer,
    );
    if (!isAnswerMatch) {
      throw new UnauthorizedException('Security answer is incorrect');
    }

    await this.usersService.update(user.id, { password: newPassword });

    return { message: 'Password reset successfully' };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.findByUserId(userId);
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(changePasswordDto.old_password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('기존 비밀번호가 일치하지 않습니다.');
    }

    await this.usersService.update(user.id, { password: changePasswordDto.new_password });

    return { message: '비밀번호가 성공적으로 변경되었습니다.' };
  }
}
