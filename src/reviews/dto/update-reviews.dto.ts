import { IsInt, IsNotEmpty } from "class-validator";

export class UpdateReviewsDTO {
    @IsNotEmpty()
    @IsInt()
    rating: number;

    @IsNotEmpty()
    content: string;
}
