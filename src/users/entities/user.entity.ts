import { Comment } from "src/comment/entities/comment.entitiy";
import { DiaryEntry } from "src/diary_entries/entities/diary-entry.entity";
import { Post } from "src/posts/entities/post.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'varchar', length: 50 })
    nickname: string;

    @Column({ type: 'enum', enum: ['USER', 'ADMIN'], default: 'USER', nullable: true })
    role?: 'USER' | 'ADMIN';

    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)'})
    updated_at: Date;

    @OneToMany(() => Post, post => post.user, { eager: true })
    posts: Post[];

    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[];
}
