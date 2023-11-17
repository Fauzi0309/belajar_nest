import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityNotFoundError, Repository } from "typeorm";
import { Reviews } from "./entities/reviews.entity";
import { CreateReviewsDTO } from "./dto/create-reviews.dto";
import { UsersService } from "#/users/users.service";
import { UpdateReviewsDTO } from "./dto/update-reviews.dto";


@Injectable()
export class ReviewsService {
    constructor(
    @InjectRepository(Reviews)
    private reviewsRepository: Repository<Reviews>,
    private userService: UsersService
    ){}

    findAll() {
        return this.reviewsRepository.findAndCount({
            relations: {
                user:true
            }
        });
      }
    
    async create(createReviewsDTO: CreateReviewsDTO){
        try {
            // cek user id is valid
            const findOneUserId = await this.userService.findOne(createReviewsDTO.userId)

            // kalau valid baru kita create
            const reviewsEntity = new Reviews
            reviewsEntity.rating = createReviewsDTO.rating
            reviewsEntity.content = createReviewsDTO.content
            reviewsEntity.user = findOneUserId

            const insertReview = await this.reviewsRepository.insert
            (reviewsEntity)
            return await this.reviewsRepository.findOneOrFail({
                where: {
                    id: insertReview.identifiers[0].id
                },
            })
        } catch (e) {
            throw e
            
        }
    }

    async findOneById(id: string) {
        try {
            return await this.reviewsRepository.findOneOrFail({
                where: {id},
                relations: {user:true}
            })
        } catch (e) {
            if (e instanceof EntityNotFoundError) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        error: "data not found"
                },
                HttpStatus.NOT_FOUND
                )
            } else {
                throw e
            }
        }
    }

    async update(id: string, updateReviewDTO: UpdateReviewsDTO){
        try {
            // cari id valid atau engga
            await this.findOneById(id)
    
            //kalau valid update datanya
            const reviewsEntity = new Reviews
            reviewsEntity.rating = updateReviewDTO.rating
            reviewsEntity.content = updateReviewDTO.content

            await this.reviewsRepository.update(id, reviewsEntity)
    
            //return data setelah diupdate
            return await this.reviewsRepository.findOneOrFail({
                where: {
                    id,
                }
            })       
        } catch (e) {
            throw e
        }
    }

    async softDeleteById(id: string){
        try {
            // cari dulu baru id valid atau engga
            await this.findOneById(id)

            // kalau mau langsung delete
            await this.reviewsRepository.softDelete(id)
            
            return "success" 
        } catch (e) {
            throw e
        }
    }
}