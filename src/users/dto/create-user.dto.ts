import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123' })
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'Some dude' })
    @IsNotEmpty()
    nickname: string;
}
