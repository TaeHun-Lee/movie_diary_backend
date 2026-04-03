import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiTags,
    ApiResponse,
    ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
    },
});

@ApiTags('Uploads')
@Controller('uploads')
export class UploadController {
    @Post()
    @UseInterceptors(FileInterceptor('file', { storage }))
    @ApiOperation({ summary: 'Upload an image file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'File successfully uploaded, returns the file URL' })
    @ApiBadRequestResponse({ type: ErrorResponseDto })
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        // Return relative URL to allow frontend to prepend correct base URL
        return { url: `/uploads/${file.filename}` };
    }
}
