
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
    Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('personal_diary')
@Unique(['user', 'date'])
export class PersonalDiary {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ type: 'date' })
    date: string; // YYYY-MM-DD

    @Column({ type: 'text' })
    content: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
