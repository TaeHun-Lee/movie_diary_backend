import { Comment } from "src/comment/entities/comment.entitiy";
import { DiaryEntry } from "src/diary_entries/entities/diary-entry.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)'})
    updated_at: Date;

    @ManyToOne(() => User, user => user.posts, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Comment, (comment) => comment.post, { eager: true, cascade: true })
    comments: Comment[];

    @OneToMany(() => DiaryEntry, diaryEntry => diaryEntry.post, { eager: true, cascade: true })
    diaryEntries: DiaryEntry[];
}
