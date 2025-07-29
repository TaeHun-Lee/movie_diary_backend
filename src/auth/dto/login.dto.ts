import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {

	@ApiProperty({ example: 'sample@email.com' })
  @IsEmail()
  email: string;

	@ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  password: string;
}
