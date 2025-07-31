import { IsDateString, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsDateString()
    watchedAt: Date;

    @IsNumber()
    @Min(0)
    @Max(10)
    rating: number;

    @IsString()
    review: string;
}
