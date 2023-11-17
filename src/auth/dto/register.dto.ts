import { IsNotEmpty } from "class-validator";

export class ResgisterDTO{
    @IsNotEmpty()
    username:string;

    @IsNotEmpty()
    password:string;

    @IsNotEmpty()
    firstName:string;

    @IsNotEmpty()
    lastName:string;
}