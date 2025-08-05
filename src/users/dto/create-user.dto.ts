import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'sample_user' })
    @IsString()
    user_id: string;

    @ApiProperty({ example: 'password123' })
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'Some dude' })
    @IsNotEmpty()
    nickname: string;
}
