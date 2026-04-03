import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ 
    description: 'The content of the comment',
    example: '정말 재미있는 영화였어요!' 
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ 
    description: 'The ID of the post to comment on',
    example: 1 
  })
  @IsNumber()
  @IsNotEmpty()
  post_id: number;
}
