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
}