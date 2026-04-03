import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Post Photos')
@Controller('post-photos')
export class PostPhotosController {}
