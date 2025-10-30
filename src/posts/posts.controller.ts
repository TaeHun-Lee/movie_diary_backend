import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserDecorator } from 'src/auth/user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('posts')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create(createPostDto, req.user);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get('my')
  findMyPosts(@UserDecorator() user: User) {
    return this.postsService.findMyPosts(user);
  }

  @Get('popular')
  findTop50() {
    return this.postsService.findTop50ByLikes();
  }

  @Get('movie/:movieId/popular')
  findTop10ForMovie(@Param('movieId') movieId: string) {
    return this.postsService.findTop10ByLikesForMovie(+movieId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id') 
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @UserDecorator() user: User) {
    return this.postsService.update(+id, updatePostDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserDecorator() user: User) {
    return this.postsService.remove(+id, user);
  }
}
