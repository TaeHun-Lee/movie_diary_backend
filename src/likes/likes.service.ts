import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async toggleLike(user: User, post_id: number) {
    const post = await this.postRepository.findOne({ where: { id: post_id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { user_id: user.id, post_id },
    });

    if (existingLike) {
      // Unlike
      await this.likeRepository.remove(existingLike);
      post.likes_count = Math.max(0, post.likes_count - 1);
      await this.postRepository.save(post);
      return { liked: false, likes_count: post.likes_count };
    } else {
      // Like
      const like = this.likeRepository.create({
        user_id: user.id,
        post_id,
      });
      await this.likeRepository.save(like);
      post.likes_count += 1;
      await this.postRepository.save(post);
      return { liked: true, likes_count: post.likes_count };
    }
  }

  async isLiked(userId: number, postId: number) {
    const like = await this.likeRepository.findOne({
      where: { user_id: userId, post_id: postId },
    });
    return !!like;
  }
}
