import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The content of the comment',
    example: 'This is a great movie!',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'The ID of the post to which the comment belongs',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @ApiProperty({
    description: 'The ID of the user who created the comment',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
