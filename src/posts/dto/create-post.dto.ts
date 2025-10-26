import { Type } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Max, Min, ValidateNested } from "class-validator";
import { CreateMovieDto } from "src/movies/dto/create-movie.dto";

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

    @IsNotEmpty()
    @IsString()
    movie_docId: string;

    @IsNotEmpty()
    @IsDateString()
    watched_at: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(10)
    rating: number;

    @IsOptional()
    @IsString()
    @IsUrl()
    photo_url?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateMovieDto)
    movieData?: CreateMovieDto;
}
