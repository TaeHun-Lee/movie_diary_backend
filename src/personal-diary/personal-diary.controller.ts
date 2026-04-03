import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import { PersonalDiaryService } from './personal-diary.service';
import { CreatePersonalDiaryDto } from './dto/create-personal-diary.dto';
import { UpdatePersonalDiaryDto } from './dto/update-personal-diary.dto';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('Personal Diary')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('personal-diary')
export class PersonalDiaryController {
    constructor(private readonly personalDiaryService: PersonalDiaryService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new personal diary entry' })
    @ApiResponse({ status: 201, description: 'Diary entry successfully created' })
    @ApiBadRequestResponse({ type: ErrorResponseDto })
    @ApiUnauthorizedResponse({ type: ErrorResponseDto })
    create(@Request() req, @Body() createPersonalDiaryDto: CreatePersonalDiaryDto) {
        return this.personalDiaryService.create(req.user, createPersonalDiaryDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all personal diary entries for the current user' })
    @ApiResponse({ status: 200, description: 'Return list of diary entries' })
    @ApiUnauthorizedResponse({ type: ErrorResponseDto })
    findAll(@Request() req) {
        return this.personalDiaryService.findAll(req.user);
    }

    @Get('date/:date')
    @ApiOperation({ summary: 'Get a personal diary entry by specific date' })
    @ApiResponse({ status: 200, description: 'Return the diary entry for the date' })
    @ApiNotFoundResponse({ type: ErrorResponseDto })
    @ApiUnauthorizedResponse({ type: ErrorResponseDto })
    findByDate(@Request() req, @Param('date') date: string) {
        return this.personalDiaryService.findByDate(req.user, date);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a personal diary entry' })
    @ApiResponse({ status: 200, description: 'Diary entry successfully updated' })
    @ApiNotFoundResponse({ type: ErrorResponseDto })
    @ApiBadRequestResponse({ type: ErrorResponseDto })
    @ApiUnauthorizedResponse({ type: ErrorResponseDto })
    update(
        @Request() req,
        @Param('id') id: string,
        @Body() updatePersonalDiaryDto: UpdatePersonalDiaryDto,
    ) {
        return this.personalDiaryService.update(+id, req.user, updatePersonalDiaryDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a personal diary entry' })
    @ApiResponse({ status: 200, description: 'Diary entry successfully deleted' })
    @ApiNotFoundResponse({ type: ErrorResponseDto })
    @ApiUnauthorizedResponse({ type: ErrorResponseDto })
    remove(@Request() req, @Param('id') id: string) {
        return this.personalDiaryService.remove(+id, req.user);
    }
}
