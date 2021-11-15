import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto{

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,{message: "The password is to weak(put 8 characters)"}
    )
    password: string;
}