import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Genre } from '../genres/entities/genre.entity';
import { PostPhoto } from '../post-photos/entities/post-photo.entity';
import { PersonalDiary } from '../personal-diary/entities/personal-diary.entity';

config();

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Post, Movie, Genre, PostPhoto, PersonalDiary],
  migrations: ['src/db/migrations/*.ts'],
  synchronize: false,
});
