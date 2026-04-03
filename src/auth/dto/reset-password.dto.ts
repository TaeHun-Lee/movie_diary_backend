import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({ 
        description: 'The unique ID of the user',
        example: 'sample_user' 
    })
    @IsString()
    @IsNotEmpty()
    user_id: string;

    @ApiProperty({ 
        description: 'The answer to the security question for the account',
        example: '우리집 강아지' 
    })
    @IsString()
    @IsNotEmpty()
    security_answer: string;

    @ApiProperty({ 
        description: 'The new password to set for the user',
        example: 'newPassword123',
        minLength: 6,
    })
    @IsString()
    @MinLength(6)
    new_password: string;
}
