import { Type } from "class-transformer";
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";

class DiaryEntryInput {
  @IsInt()
  movie_id: number;

  @IsDateString()
  watched_at: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @IsString()
  review: string;
}

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsString()
    place?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DiaryEntryInput)
    diaryEntries: DiaryEntryInput[];
}
