import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'sample_user' })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsNotEmpty()
  password: string;
}
