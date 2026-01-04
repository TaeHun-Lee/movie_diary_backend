import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { MoviesModule } from './movies/movies.module';
import { HttpModule } from '@nestjs/axios';
import { CommentModule } from './comment/comment.module';
import { GenresModule } from './genres/genres.module';
import { PostLikesModule } from './post-likes/post-likes.module';
import { PostPhotosModule } from './post-photos/post-photos.module';
import { UploadModule } from './upload/upload.module';
import { PersonalDiaryModule } from './personal-diary/personal-diary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST', 'localhost'),
        port: +config.get<number>('DB_PORT', 3306),
        username: config.get('DB_USERNAME', 'root'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        timezone: 'Asia/Seoul',
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
    }),
    HttpModule,
    UsersModule,
    CommentModule,
    AuthModule,
    PostsModule,
    MoviesModule,
    GenresModule,
    PostLikesModule,
    PostPhotosModule,
    UploadModule,
    PersonalDiaryModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
