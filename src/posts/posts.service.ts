import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  ) { }

  private getPostsQueryBuilder() {
    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('post.movie', 'movie')
      .leftJoinAndSelect('movie.genres', 'genres')
      .leftJoinAndSelect('post.photos', 'photos');
  }

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
        const photos = photo_urls.map((url) =>
          queryRunner.manager.create(PostPhoto, {
            photo_url: url,
            post: savedPost,
          }),
        );
        await queryRunner.manager.save(photos);
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
    return this.getPostsQueryBuilder()
      .orderBy('post.created_at', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.getPostsQueryBuilder()
      .where('post.id = :id', { id })
      .getOne();
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async findMyPosts(user: User): Promise<Post[]> {
    return this.getPostsQueryBuilder()
      .where('post.user.id = :userId', { userId: user.id })
      .orderBy('post.updated_at', 'DESC')
      .getMany();
  }

  async findTop50ByLikes(): Promise<Post[]> {
    return this.getPostsQueryBuilder()
      .orderBy('post.likes_count', 'DESC')
      .take(50)
      .getMany();
  }

  async findTop10ByLikesForMovie(movieId: number): Promise<Post[]> {
    return this.getPostsQueryBuilder()
      .where('post.movie.id = :movieId', { movieId })
      .orderBy('post.likes_count', 'DESC')
      .take(10)
      .getMany();
  }

  async findMyPostsByMovieDocId(docId: string, user: User): Promise<Post[]> {
    const movie = await this.moviesService.findMovieByDocId(docId);
    if (!movie) {
      return []; // Return empty if movie doesn't exist yet (no posts)
    }
    return this.getPostsQueryBuilder()
      .where('post.movie.id = :movieId', { movieId: movie.id })
      .andWhere('post.user.id = :userId', { userId: user.id })
      .orderBy('post.created_at', 'DESC')
      .getMany();
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user', 'photos'],
    });
    if (!post) {
      throw new NotFoundException(`Post not found`);
    }
    if (post.user.id !== user.id) {
      throw new ForbiddenException('Not Authorized');
    }

    const { photo_urls, ...updateData } = updatePostDto;

    Object.assign(post, updateData);

    const savedPost = await this.postRepository.save(post);

    if (photo_urls) {
      // Find photos that are in DB but NOT in the new list (to be deleted)
      const existingUrls = post.photos.map((p) => p.photo_url);
      const toDelete = existingUrls.filter((url) => !photo_urls.includes(url));

      if (toDelete.length > 0) {
        await this.postPhotosService.deletePhysicalFiles(toDelete);
      }

      await this.postPhotosService.deleteByPostId(id);
      if (photo_urls.length > 0) {
        await this.postPhotosService.createPhotos(savedPost, photo_urls);
      }
    }

    return this.findOne(savedPost.id);
  }

  async remove(id: number, user: User) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user', 'photos'],
    });
    if (!post) {
      throw new NotFoundException(`Post not found`);
    }
    if (post.user.id !== user.id) {
      throw new ForbiddenException('Not Authorized');
    }

    // Delete physical files
    if (post.photos && post.photos.length > 0) {
      const urls = post.photos.map((p) => p.photo_url);
      await this.postPhotosService.deletePhysicalFiles(urls);

      // Delete photo records from DB (Hard Delete) to avoid soft-remove cascade error
      await this.postPhotosService.deleteByPostId(id);

      // Detach photos from the post object in memory so softRemove doesn't try to cascade
      post.photos = [];
    }

    await this.postRepository.softRemove(post);
    return { message: `Post with ID ${id} has been successfully deleted.` };
  }
}
