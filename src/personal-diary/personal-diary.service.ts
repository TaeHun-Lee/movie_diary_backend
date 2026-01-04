
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonalDiary } from './entities/personal-diary.entity';
import { CreatePersonalDiaryDto } from './dto/create-personal-diary.dto';
import { UpdatePersonalDiaryDto } from './dto/update-personal-diary.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PersonalDiaryService {
    constructor(
        @InjectRepository(PersonalDiary)
        private readonly diaryRepository: Repository<PersonalDiary>,
    ) { }

    async create(user: User, createDto: CreatePersonalDiaryDto) {
        // Check if entry exists for this date
        const existing = await this.diaryRepository.findOne({
            where: {
                user: { id: user.id },
                date: createDto.date,
            },
        });

        if (existing) {
            // Update existing
            existing.content = createDto.content;
            return this.diaryRepository.save(existing);
        }

        // Create new
        const diary = this.diaryRepository.create({
            ...createDto,
            user,
        });
        return this.diaryRepository.save(diary);
    }

    findAll(user: User) {
        return this.diaryRepository.find({
            where: { user: { id: user.id } },
            order: { date: 'DESC' },
        });
    }

    async findByDate(user: User, date: string) {
        const diary = await this.diaryRepository.findOne({
            where: {
                user: { id: user.id },
                date,
            },
        });
        // Return null or undefined if not found? 
        // Usually fetching details should throw if not found, but for "clicking a date on calendar", 
        // it's okay to return null if no entry exists.
        return diary;
    }

    async update(id: number, user: User, updateDto: UpdatePersonalDiaryDto) {
        const diary = await this.diaryRepository.findOne({
            where: { id, user: { id: user.id } },
        });

        if (!diary) {
            throw new NotFoundException(`Diary entry not found`);
        }

        Object.assign(diary, updateDto);
        return this.diaryRepository.save(diary);
    }

    async remove(id: number, user: User) {
        const result = await this.diaryRepository.delete({
            id,
            user: { id: user.id },
        });
        if (result.affected === 0) {
            throw new NotFoundException(`Diary entry not found`);
        }
    }
}
