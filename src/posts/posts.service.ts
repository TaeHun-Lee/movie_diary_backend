import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { DataSource, Repository } from 'typeorm';
import { MoviesService } from 'src/movies/movies.service';
import { PostPhotosService } from 'src/post-photos/post-photos.service';
import { PostPhoto } from 'src/post-photos/entities/post-photo.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly moviesService: MoviesService,
    private readonly postPhotosService: PostPhotosService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const { movie: movieData, photo_urls, ...postData } = createPostDto;

    const movie = await this.moviesService.findOrCreateMovie(movieData);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const postToSave = this.postRepository.create({
        ...postData,
        user,
        movie,
      });
      const savedPost = await queryRunner.manager.save(postToSave);

      if (photo_urls && photo_urls.length > 0) {
        await this.postPhotosService.createPhotos(savedPost, photo_urls);
      }

      await queryRunner.commitTransaction();
      return this.findOne(savedPost.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['user', 'comments', 'movie', 'photos'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user', 'comments', 'movie', 'photos'],
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async findMyPosts(user: User): Promise<Post[]> {
    return this.postRepository.find({
      where: { user: { id: user.id } },
      relations: ['user', 'comments', 'movie', 'photos'],
      order: { created_at: 'DESC' },
    });
  }

  async findTop50ByLikes(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['user', 'comments', 'movie', 'photos'],
      order: { likes_count: 'DESC' },
      take: 50,
    });
  }

  async findTop10ByLikesForMovie(movieId: number): Promise<Post[]> {
    return this.postRepository.find({
      where: { movie: { id: movieId } },
      relations: ['user', 'comments', 'movie', 'photos'],
      order: { likes_count: 'DESC' },
      take: 10,
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

    Object.assign(post, updatePostDto);

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
