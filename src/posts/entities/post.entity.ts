import { Comment } from "src/comment/entities/comment.entitiy";
import { DiaryEntry } from "src/diary_entries/entities/diary-entry.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @Column({ type: 'date'})
    watchedAt: Date;

    @Column({ type: 'float' })
    rating: number;

    @Column({ type: 'text' })
    review: string;

    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)'})
    updated_at: Date;

    @ManyToOne(() => User, user => user.posts, { nullable: false })
    user: User;

    @OneToMany(() => Comment, (comment) => comment.post, { eager: true })
    comments: Comment[];

    @OneToMany(() => DiaryEntry, diaryEntry => diaryEntry.post, { eager: true })
    diaryEntries: DiaryEntry[];
}
