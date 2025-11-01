import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostLike } from './entities/post-like.entity';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostLikesService {
  constructor(
    @InjectRepository(PostLike)
    private readonly postLikesRepository: Repository<PostLike>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async likePost(postId: number, user: User): Promise<void> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.postLikesRepository.findOne({
      where: { post: { id: postId }, user: { id: user.id } },
    });

    if (existingLike) {
      throw new ConflictException('You have already liked this post');
    }

    const newLike = this.postLikesRepository.create({ post, user });
    await this.postLikesRepository.save(newLike);

    post.likes_count = (post.likes_count || 0) + 1;
    await this.postsRepository.save(post);
  }

  async unlikePost(postId: number, user: User): Promise<void> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const like = await this.postLikesRepository.findOne({
      where: { post: { id: postId }, user: { id: user.id } },
    });

    if (!like) {
      throw new NotFoundException('You have not liked this post');
    }

    await this.postLikesRepository.remove(like);

    post.likes_count = Math.max(0, (post.likes_count || 0) - 1);
    await this.postsRepository.save(post);
  }
}
