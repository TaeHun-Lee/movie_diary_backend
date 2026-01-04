import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({ example: 'sample_user' })
    @IsString()
    @IsNotEmpty()
    user_id: string;

    @ApiProperty({ example: '우리집 강아지' })
    @IsString()
    @IsNotEmpty()
    security_answer: string;

    @ApiProperty({ example: 'newPassword123' })
    @IsString()
    @MinLength(6)
    new_password: string;
}
