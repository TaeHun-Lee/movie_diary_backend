import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'The unique ID of the user',
    example: 'sample_user',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: 'The password for the account',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'The display name of the user',
    example: 'Some dude',
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    description: 'A security question for password recovery',
    example: '가장 아끼는 보물 1호는?',
  })
  @IsString()
  @IsNotEmpty()
  security_question: string;

  @ApiProperty({
    description: 'The answer to the security question',
    example: '우리집 강아지',
  })
  @IsString()
  @IsNotEmpty()
  security_answer: string;
}
