import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });
    return this.getToken(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByUserId(loginDto.user_id);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return this.getToken(user);
  }

  getToken(user: User) {
    const payload = {
      sub: user.id,
      user_id: user.user_id,
      nickname: user.nickname,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getSecurityQuestion(userId: string) {
    const user = await this.usersService.findByUserId(userId);
    // Do not throw specific error to avoid enumeration? 
    // For this app, explicit error is fine for UX.
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
    console.log(`[DEBUG] ResetPassword for ${userId}`);
    console.log(`[DEBUG] DB Answer: '${user.security_answer}'`);
    console.log(`[DEBUG] Input Answer: '${securityAnswer}'`);

    if (!user) throw new UnauthorizedException('User not found');

    if (user.security_answer !== securityAnswer) {
      console.log('[DEBUG] Answer mismatch!');
      throw new UnauthorizedException('Security answer is incorrect');
    }

    // usersService.update expects UpdateUserDto.
    // CreateUserDto has 'password' (string). UpdateUserDto extends Partial(CreateUserDto).
    // So { password: hashedPassword } is valid.
    await this.usersService.update(user.id, { password: newPassword });
    console.log('[DEBUG] Password updated.');

    return { message: 'Password reset successfully' };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.findByUserId(userId);
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(changePasswordDto.old_password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('기존 비밀번호가 일치하지 않습니다.');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.new_password, 10);
    // usersService.update handles hashing again, so we should NOT hash here if service does it.
    // Wait, let's check usersService.update again.
    // In step 23, I added hashing to usersService.update.
    // So if pass 'password', usersService.update hashes it again?
    // Let's check users.service.ts.
    // "if (updateUserDto.password) { updateUserDto.password = await bcrypt.hash(...) }"
    // So if pass plain text new_password, it will be hashed.
    // If pass hashed, it will be double hashed!
    // So I should pass PLAIN text to usersService.update.
    await this.usersService.update(user.id, { password: changePasswordDto.new_password });

    return { message: '비밀번호가 성공적으로 변경되었습니다.' };
  }
}
