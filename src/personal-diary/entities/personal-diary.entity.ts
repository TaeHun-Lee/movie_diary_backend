
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('personal_diary')
// Unique constraint: one diary entry per user per day?
// Actually user might want to write multiple. But "date" implies specific date.
// If I use 'date' column as DATE type, making it unique per user creates a "Daily Log" constraint.
// I will enforce uniqueness for now to keep it simple (Daily Diary).
@Unique(['user', 'date'])
export class PersonalDiary {
    @PrimaryGeneratedColumn()
    id: number;

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
