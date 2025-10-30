import { Genre } from "src/genres/entities/genre.entity";
import { Post } from "src/posts/entities/post.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'movies' })
export class Movie {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    docId: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    director: string;

    @Column({ nullable: true })
    release_date: Date;

    @Column({ nullable: true })
    poster: string;

    @Column({ type: 'json', nullable: true })
    stills: string[];

    @Column({ type: 'text', nullable: true })
    plot: string;

    @ManyToMany(() => Genre, (genre) => genre.movies, { cascade: true })
    @JoinTable({
        name: 'movie_genres',
        joinColumn: { name: 'movie_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'genre_id', referencedColumnName: 'id' },
    })
    genres: Genre[];

    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;

    @OneToMany(() => Post, post => post.movie)
    posts: Post[];
}
    