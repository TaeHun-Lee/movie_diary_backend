
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLike } from './entities/post-like.entity';
import { PostLikesController } from './post-likes.controller';
import { PostLikesService } from './post-likes.service';
import { Post } from 'src/posts/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostLike, Post])],
  providers: [PostLikesService],
  controllers: [PostLikesController],
})
export class PostLikesModule {}
