import { IsNotEmpty, IsString, MinLength } from "class-validator";

export default class CreateUserDto {

    @IsNotEmpty()
    @MinLength(3)
    username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;
}