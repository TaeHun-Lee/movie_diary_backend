import { Module } from '@nestjs/common';
import { PostPhotosService } from './post-photos.service';
import { PostPhotosController } from './post-photos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostPhoto } from './entities/post-photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostPhoto])],
  controllers: [PostPhotosController],
  providers: [PostPhotosService],
  exports: [PostPhotosService],
})
export class PostPhotosModule {}
