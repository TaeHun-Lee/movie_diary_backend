import { Controller, Post, Param, Delete, UseGuards } from '@nestjs/common';
import { PostLikesService } from './post-likes.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { UserDecorator } from 'src/auth/user.decorator';

@ApiTags('posts-likes')
@Controller('post-likes')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PostLikesController {
  constructor(private readonly postLikesService: PostLikesService) {}

  @Post(':postId/like')
  likePost(@Param('postId') postId: string, @UserDecorator() user: User) {
    return this.postLikesService.likePost(+postId, user);
  }

  @Delete(':postId/unlike')
  unlikePost(@Param('postId') postId: string, @UserDecorator() user: User) {
    return this.postLikesService.unlikePost(+postId, user);
  }
}
