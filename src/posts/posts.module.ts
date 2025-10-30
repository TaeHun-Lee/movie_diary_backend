import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { MoviesModule } from 'src/movies/movies.module';
import { PostPhotosModule } from 'src/post-photos/post-photos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    MoviesModule,
    PostPhotosModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
