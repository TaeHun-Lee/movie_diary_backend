import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { Movie } from 'src/movies/entities/movie.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}
  
  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const { movie_docId, movieData, ...postData } = createPostDto;

    let movie = await this.movieRepository.findOneBy({ docId: movie_docId });

    if (!movie) {
      if (!movieData) {
        throw new NotFoundException(`Movie with ID ${movie_docId} not found and no movie data provided to create one.`);
      }
      const newMovie = this.movieRepository.create(movieData);
      movie = await this.movieRepository.save(newMovie);
    }

    const post = this.postRepository.create({
      ...postData,
      user,
      movie,
    });
    return this.postRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['user', 'comments', 'movie'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user', 'comments', 'movie'],
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async findMyPosts(user: User): Promise<Post[]> {
    return this.postRepository.find({
      where: { user: { id: user.id } },
      relations: ['user', 'comments', 'movie'],
      order: { created_at: 'DESC' },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto, user: User): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id }, relations: ['user'] });
    if (!post) {
      throw new NotFoundException(`Post not found`);
    }
    if (post.user.id !== user.id) {
      throw new ForbiddenException('Not Authorized');
    }

    // Update fields from updatePostDto
    Object.assign(post, updatePostDto);

    if (updatePostDto.movie_docId) {
      const movie = await this.movieRepository.findOneBy({ docId: updatePostDto.movie_docId });
      if (!movie) {
        throw new NotFoundException(`Movie with ID ${updatePostDto.movie_docId} not found`);
      }
      post.movie = movie;
    }

    return this.postRepository.save(post);
  }

  async remove(id: number, user: User) {
    const post = await this.postRepository.findOne({ where: { id }, relations: ['user'] });
    if (!post) {
      throw new NotFoundException(`Post not found`);
    }
    if (post.user.id !== user.id) {
      throw new ForbiddenException('Not Authorized');
    }
    return this.postRepository.remove(post);
  }
}
