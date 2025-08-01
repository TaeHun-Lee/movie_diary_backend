import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { In, Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';
import { DiaryEntry } from 'src/diary_entries/entities/diary-entry.entity';
import { Movie } from 'src/movies/entities/movie.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(DiaryEntry)
    private readonly diaryEntryRepository: Repository<DiaryEntry>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}
  
  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const { diaryEntries, ...postData } = createPostDto;

    // 영화 존재 여부 검증
    const movieIds = diaryEntries.map(entry => entry.movie_id);
    const movies = await this.movieRepository.findBy({
      id: In(movieIds),
    });
    const movieMap = new Map(movies.map(movie => [movie.id, movie]));

    const entries = await Promise.all(
      diaryEntries.map(async (entry) => {
        const movie = movieMap.get(entry.movie_id);
        if (!movie) {
          throw new NotFoundError(`Movie with ID ${entry.movie_id} not found`);
        }
        return this.diaryEntryRepository.create({
          movie,
          watched_at: new Date(entry.watched_at),
          rating: entry.rating,
          review: entry.review,
        });
      })
    );

    const userFilteredDiaryEntries = entries.filter(
      (diaryEntry) => diaryEntry.post?.user?.id === user.id,
    );

    const post = this.postRepository.create({
      ...postData,
      user: user,
      diaryEntries: userFilteredDiaryEntries,
    });
    return this.postRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['user', 'comments', 'diaryEntries'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user', 'comments', 'diaryEntries'],
    });
    if (!post) {
      throw new NotFoundError(`Post with ID ${id} not found`);
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, user: User): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id }, relations: ['user', 'diaryEntries'] });
    if (!post) {
      throw new NotFoundError(`Post not found`);
    }
    if (post.user.id !== user.id) {
      throw new ForbiddenException('Not Authorized');
    }

    if (updatePostDto.title) post.title = updatePostDto.title;
    if (updatePostDto.content) post.content = updatePostDto.content;
    if (updatePostDto.place) post.place = updatePostDto.place;

    if (updatePostDto.diaryEntries && updatePostDto.diaryEntries.length > 0) {
      await this.diaryEntryRepository.remove(post.diaryEntries);
      const movieIds = updatePostDto.diaryEntries.map(entry => entry.movie_id);
      const movies = await this.movieRepository.findBy({
        id: In(movieIds),
      });
      const movieMap = new Map(movies.map(movie => [movie.id, movie]));
      const newEntries = updatePostDto.diaryEntries.map(entry => {
        let movie = movieMap.get(entry.movie_id);
        if (!movie) {
          throw new NotFoundError(`Movie with ID ${entry.movie_id} not found`);
        }
        return this.diaryEntryRepository.create({
          movie,
          watched_at: new Date(entry.watched_at),
          rating: entry.rating,
          review: entry.review,
        });
      });
      post.diaryEntries = await this.diaryEntryRepository.save(newEntries);
    }
    return this.postRepository.save(post);
  }

  async remove(id: number, user: User) {
    const post = await this.postRepository.findOne({ where: { id }, relations: ['user'] });
    if (!post) {
      throw new NotFoundError(`Post not found`);
    }
    if (post.user.id !== user.id) {
      throw new ForbiddenException('Not Authorized');
    }
    return this.postRepository.remove(post);
  }
}
