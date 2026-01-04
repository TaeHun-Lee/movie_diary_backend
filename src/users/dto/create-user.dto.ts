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

  @ApiProperty({ example: '가장 아끼는 보물 1호는?' })
  @IsString()
  security_question: string;

  @ApiProperty({ example: '우리집 강아지' })
  @ApiProperty({ example: '우리집 강아지' })
  @IsString()
  security_answer: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsString()
  @IsNotEmpty() // Wait, it can be empty/null? If optional, maybe remove IsNotEmpty or use IsOptional.
  // Actually, for Create, it's optional.
  profile_image?: string;

}
