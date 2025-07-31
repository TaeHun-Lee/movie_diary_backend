import { IsEmail, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {

	@ApiProperty({ example: 'sample@email.com' })
  	@IsEmail()
	email: string;

	@ApiProperty({ example: 'password123' })
	@MinLength(6)
  	password: string;

	@ApiProperty({ example: 'Some dude' })
	@IsNotEmpty()
  	nickname: string;
}