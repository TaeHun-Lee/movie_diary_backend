import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostPhoto } from './entities/post-photo.entity';
import { Repository } from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PostPhotosService {
  constructor(
    @InjectRepository(PostPhoto)
    private readonly postPhotoRepository: Repository<PostPhoto>,
  ) { }

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

  async deleteByPostId(postId: number): Promise<void> {
    await this.postPhotoRepository.delete({ post: { id: postId } });
  }

  async deletePhysicalFiles(photoUrls: string[]): Promise<void> {
    for (const url of photoUrls) {
      if (!url) continue;
      // url format: /uploads/filename.jpg
      const filename = url.split('/').pop();
      if (!filename) continue;

      // Current dir: dist/post-photos/
      // Go up two levels to reach root, then into uploads
      const filePath = path.join(__dirname, '..', '..', 'uploads', filename);

      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Deleted file: ${filePath}`);
        }
      } catch (err) {
        console.error(`Failed to delete file ${filePath}:`, err);
      }
    }
  }
}
