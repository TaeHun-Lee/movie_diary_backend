import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'sample_user' })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'Some dude' })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({ example: '가장 아끼는 보물 1호는?' })
  @IsString()
  security_question: string;

  @ApiProperty({ example: '우리집 강아지' })
  @IsString()
  security_answer: string;
}
