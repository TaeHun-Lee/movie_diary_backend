import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserDecorator } from 'src/auth/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @UserDecorator() user: User,
  ) {
    return this.commentService.create(createCommentDto, user);
  }

  @Get('/post/:postId')
  findByPost(@Param('postId') postId: number) {
    return this.commentService.findByPost(postId);
  }

  @Patch(':commentId')
  update(
    @Param('commentId') commentId: number,
    @Body() updateDto: CreateCommentDto,
    @UserDecorator() user: User,
  ) {
    return this.commentService.update(commentId, updateDto, user);
  }

  @Delete(':commentId')
  delete(@Param('commentId') commentId: number, @UserDecorator() user: User) {
    return this.commentService.delete(commentId, user);
  }
}
