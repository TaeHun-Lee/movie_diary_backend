
import { PartialType } from '@nestjs/swagger';
import { CreatePersonalDiaryDto } from './create-personal-diary.dto';

export class UpdatePersonalDiaryDto extends PartialType(CreatePersonalDiaryDto) { }
