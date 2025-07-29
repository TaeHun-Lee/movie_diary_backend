import { Post } from "src/post/entities/post.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    content: string;

    @ManyToOne(() => Post, post => post.comments, { onDelete: 'CASCADE' })
    post: Post;

    @ManyToOne(() => User, user => user.comments, { eager: true })
    user: User;

    @CreateDateColumn()
    createdAt: Date;
}