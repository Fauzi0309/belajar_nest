import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { HttpStatusCode } from 'axios';
import { CreateReviewsDTO } from './dto/create-reviews.dto';
import { UpdateReviewsDTO } from './dto/update-reviews.dto';

@Controller('reviews')
export class ReviewsController {
    constructor(
        private reviesService: ReviewsService
    ){}

    @Get()
    async getAll(){
        const [data, count] = await this.reviesService.findAll();

        return {
            data,
            count,
            statusCode: HttpStatusCode.Ok,
            message: "success"
        }
    }

    @Post()
    async create(@Body( ) createReviewsDTO: CreateReviewsDTO){
        const data = await this.reviesService.create(createReviewsDTO);

        return {
            data,
            statusCode: HttpStatus.CREATED,
            message: "success",
        }
    }

    @Get("/:id")
   async getDetailById(@Param('id', ParseUUIDPipe) id: string ){
    return {
        data: await this.reviesService.findOneById(id),
        statusCode: HttpStatus.OK,
        message: "succes",
    }
   }

   @Put("/:id")
   async update(@Param('id', ParseUUIDPipe) id:string, @Body() updateReviewDTO: UpdateReviewsDTO){
    const data = await this.reviesService.update(id, updateReviewDTO)

    return {
        data,
        statusCode: HttpStatus.OK,
        message:"succes"
    }
   }

   @Delete("/:id")
   async softDelete(@Param('id', ParseUUIDPipe) id:string){
    return {
        statusCode: HttpStatus.OK,
        message: await this.reviesService.softDeleteById(id)
    }
   }
}
