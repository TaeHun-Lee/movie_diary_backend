import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({
        example: 'oldpassword123',
        description: 'The current password of the user',
    })
    @IsString()
    @IsNotEmpty()
    old_password: string;

    @ApiProperty({
        example: 'newpassword123',
        description: 'The new password to set',
        minLength: 6,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    new_password: string;
}
