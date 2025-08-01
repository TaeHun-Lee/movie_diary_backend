import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Movie } from 'src/movies/entities/movie.entity';
import { Post } from 'src/posts/entities/post.entity';

@Entity({ name: 'diary_entries' })
export class DiaryEntry {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date', nullable: true })
    watched_at: Date;

    @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true })
    rating: number;

    @Column({ type: 'text', nullable: true })
    review: string;

    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;

    @ManyToOne(() => Movie, movie => movie.diaryEntries, { nullable: false, eager: true })
    @JoinColumn({ name: 'movie_id' })
    movie: Movie;

    @ManyToOne(() => Post, post => post.diaryEntries, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: Post;
}