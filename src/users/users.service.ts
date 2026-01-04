import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import * as fs from 'fs';
import { join } from 'path';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(user_id: string) {
    const user = await this.userRepository.findOne({ where: { user_id } });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async findByUserId(user_id: string) {
    const user = await this.userRepository.findOne({ where: { user_id } });
    if (!user) {
      throw new NotFoundException(`User with user_id not found`);
    }
    return user;
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // 프로필 이미지가 변경되었고, 기존 이미지가 존재하는 경우 삭제
    if (
      updateUserDto.profile_image !== undefined &&
      user.profile_image &&
      updateUserDto.profile_image !== user.profile_image
    ) {
      this.deleteProfileImage(user.profile_image);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  private deleteProfileImage(imagePath: string) {
    // '/uploads/'로 시작하는 내부 이미지인 경우에만 삭제 시도
    if (imagePath && imagePath.startsWith('/uploads/')) {
      try {
        const filename = imagePath.split('/').pop();
        if (filename) {
          // dist/users/users.service.js -> dist/users -> dist -> root -> uploads
          const filePath = join(__dirname, '..', '..', 'uploads', filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted user profile image: ${filePath}`);
          }
        }
      } catch (error) {
        console.error('Failed to delete profile image:', error);
        // 이미지 삭제 실패가 프로필 업데이트 실패로 이어지지 않도록 예외 무시
      }
    }
  }

  async remove(id: number) {
    // 1. Find user with relations to get file paths
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['posts', 'posts.photos'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // 2. Delete Profile Image
    if (user.profile_image) {
      this.deleteProfileImage(user.profile_image);
    }

    // 3. Delete Post Images
    if (user.posts && user.posts.length > 0) {
      for (const post of user.posts) {
        if (post.photos && post.photos.length > 0) {
          for (const photo of post.photos) {
            this.deleteProfileImage(photo.photo_url); // Reusing logic as it handles generic file paths well
          }
        }
      }
    }

    // 4. Delete User (Cascade will handle DB records for posts, comments, likes, personal_diary)
    return this.userRepository.delete(id);
  }
}
