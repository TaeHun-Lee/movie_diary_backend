import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostPhoto } from './entities/post-photo.entity';
import { Repository } from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';

@Injectable()
export class PostPhotosService {
  constructor(
    @InjectRepository(PostPhoto)
    private readonly postPhotoRepository: Repository<PostPhoto>,
  ) {}

  async createPhotos(post: Post, photoUrls: string[]): Promise<PostPhoto[]> {
    const photos = photoUrls.map((url) => {
      const photo = this.postPhotoRepository.create({
        photo_url: url,
        post: post,
      });
      return photo;
    });
    return this.postPhotoRepository.save(photos);
  }
}
