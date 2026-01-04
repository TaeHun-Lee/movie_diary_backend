
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
import { AuthGuard } from '@nestjs/passport'; // Assumed exists
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Personal Diary')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('personal-diary')
export class PersonalDiaryController {
    constructor(private readonly personalDiaryService: PersonalDiaryService) { }

    @Post()
    create(@Request() req, @Body() createPersonalDiaryDto: CreatePersonalDiaryDto) {
        return this.personalDiaryService.create(req.user, createPersonalDiaryDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.personalDiaryService.findAll(req.user);
    }

    @Get('date/:date')
    findByDate(@Request() req, @Param('date') date: string) {
        return this.personalDiaryService.findByDate(req.user, date);
    }

    @Patch(':id')
    update(
        @Request() req,
        @Param('id') id: string,
        @Body() updatePersonalDiaryDto: UpdatePersonalDiaryDto,
    ) {
        return this.personalDiaryService.update(+id, req.user, updatePersonalDiaryDto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.personalDiaryService.remove(+id, req.user);
    }
}
