import { Comment } from "src/comment/entities/comment.entitiy";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'date'})
    watchedAt: Date;

    @Column({ type: 'float' })
    rating: number;

    @Column({ type: 'text' })
    review: string;

    @ManyToOne(() => User, user => user.posts, { eager: true })
    user: User;

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];
}
