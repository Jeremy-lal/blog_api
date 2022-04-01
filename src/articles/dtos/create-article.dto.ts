import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateArticleDto {
    @IsString()
    @IsNotEmpty()
    image: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNumber()
    @IsNotEmpty()
    author_id: number;
}