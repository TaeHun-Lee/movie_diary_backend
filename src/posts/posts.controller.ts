import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PostService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserDecorator } from 'src/auth/user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('post')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postService.create(createPostDto, req.user);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get('my')
  findMyPosts(@UserDecorator() user: User) {
    return this.postService.findMyPosts(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id') 
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @UserDecorator() user: User) {
    return this.postService.update(+id, updatePostDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserDecorator() user: User) {
    return this.postService.remove(+id, user);
  }
}
