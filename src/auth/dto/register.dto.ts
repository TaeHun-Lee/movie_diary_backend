import { IsEmail, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {

	@ApiProperty({ example: 'sample@email.com' })
  	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({ example: 'password123' })
	@IsNotEmpty()
  	password: string;

	@ApiProperty({ example: 'Some dude' })
  	nickname: string;
}