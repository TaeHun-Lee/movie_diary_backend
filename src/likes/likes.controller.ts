import {
  Controller,
  Post,
  Param,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('Likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('toggle/:postId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle like on a post' })
  @ApiResponse({ status: 201, description: 'Like toggled successfully' })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  toggleLike(@Param('postId') postId: string, @Request() req) {
    return this.likesService.toggleLike(req.user, +postId);
  }

  @Get('status/:postId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if current user liked a specific post' })
  @ApiResponse({ status: 200, description: 'Return like status (boolean)' })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  isLiked(@Param('postId') postId: string, @Request() req) {
    return this.likesService.isLiked(req.user.id, +postId);
  }
}
