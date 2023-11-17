import { IsInt, IsNotEmpty } from "class-validator";

export class CreateReviewsDTO {
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    @IsInt()
    rating: number;

    @IsNotEmpty()
    content: string;
}