
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreatePersonalDiaryDto {
    @ApiProperty({ example: '2024-01-01', description: 'YYYY-MM-DD' })
    @IsDateString()
    @IsNotEmpty()
    date: string;

    @ApiProperty({ example: 'Today was a good day.' })
    @IsString()
    @IsNotEmpty()
    content: string;
}
