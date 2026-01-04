
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalDiaryService } from './personal-diary.service';
import { PersonalDiaryController } from './personal-diary.controller';
import { PersonalDiary } from './entities/personal-diary.entity';
import { User } from '../users/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PersonalDiary, User])],
    controllers: [PersonalDiaryController],
    providers: [PersonalDiaryService],
})
export class PersonalDiaryModule { }
