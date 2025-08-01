import { Module } from '@nestjs/common';
import { PostService } from './posts.service';
import { PostController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { DiaryEntry } from 'src/diary_entries/entities/diary-entry.entity';
import { Movie } from 'src/movies/entities/movie.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, DiaryEntry, Movie]),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
