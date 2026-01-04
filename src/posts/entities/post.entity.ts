import { Comment } from 'src/comment/entities/comment.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import { PostLike } from 'src/post-likes/entities/post-like.entity';
import { PostPhoto } from 'src/post-photos/entities/post-photo.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  place?: string;

  @Column({ type: 'date', nullable: true })
  watched_at?: Date | null;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  rating: number;

  @Column({ default: 0 })
  likes_count: number;

  @Column({ default: false })
  is_spoiler: boolean;


  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  deleted_at: Date | null;

  @ManyToOne(() => User, (user) => user.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.posts, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @OneToMany(() => Comment, (comment) => comment.post, {
    eager: true,
    cascade: true,
  })
  comments: Comment[];

  @OneToMany(() => PostLike, (postLike) => postLike.post, { cascade: true })
  likes: PostLike[];

  @OneToMany(() => PostPhoto, (photo) => photo.post, { cascade: true })
  photos: PostPhoto[];
}
