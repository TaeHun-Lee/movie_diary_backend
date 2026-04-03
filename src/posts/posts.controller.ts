import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserDecorator } from '../auth/user.decorator';
import { User } from '../users/entities/user.entity';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('Posts')
@Controller('posts')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new movie diary post' })
  @ApiResponse({ status: 201, description: 'Post successfully created' })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  create(@Body() createPostDto: CreatePostDto, @UserDecorator() user: User) {
    return this.postsService.create(createPostDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Return list of posts' })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  findAll(@Query() queryDto: GetPostsQueryDto) {
    return this.postsService.findAll(queryDto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get posts created by the current user' })
  @ApiResponse({ status: 200, description: 'Return list of user posts' })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  findMyPosts(@UserDecorator() user: User) {
    return this.postsService.findMyPosts(user);
  }


  @Get('movie/doc/:docId/my-reviews')
  @ApiOperation({ summary: 'Get current user reviews for a specific movie by its DocId' })
  @ApiResponse({ status: 200, description: 'Return list of reviews' })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  findMyReviewsByDocId(
    @Param('docId') docId: string,
    @UserDecorator() user: User,
  ) {
    return this.postsService.findMyPostsByMovieDocId(docId, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single post by ID' })
  @ApiResponse({ status: 200, description: 'Return the post' })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({ status: 200, description: 'Post successfully updated' })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UserDecorator() user: User,
  ) {
    return this.postsService.update(+id, updatePostDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 200, description: 'Post successfully deleted' })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  remove(@Param('id') id: string, @UserDecorator() user: User) {
    return this.postsService.remove(+id, user);
  }
}
