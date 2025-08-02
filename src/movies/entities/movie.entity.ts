import { DiaryEntry } from "src/diary_entries/entities/diary-entry.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @Column({ nullable: true })
    genre: string;

    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;

    @OneToMany(() => DiaryEntry, diaryEntry => diaryEntry.movie)
    diaryEntries: DiaryEntry[];
}
    