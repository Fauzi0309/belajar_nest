import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ResgisterDTO } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '#/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ){}

    async register(registerDTO: ResgisterDTO){
        try {
            // generate salt
            const saltGenerate = await bcrypt.genSalt()
    
            //hash password
            const password = registerDTO.password
            const hash = await bcrypt.hash(password, saltGenerate);

            const user = new User
            user.firstName = registerDTO.firstName
            user.lastName = registerDTO.lastName
            user.username = registerDTO.username
            user.salt = saltGenerate
            user.password = hash

            const createUser = await this.userRepository.insert(user)

            return await this.userRepository.findOneOrFail({
                where: {id: createUser.identifiers[0].id}
            })
            
        } catch (e) {
            throw e
        }
    }

   async login(loginDTO: LoginDTO){
    try {
        // cari data user by username
        const userOne = await this.userRepository.findOne({
            where: {username: loginDTO.username}
        })

        if (!userOne){
            throw new HttpException(
                {
                    statusCode: HttpStatus.BAD_REQUEST,
                    error: 'Username is invalid',
                },
                HttpStatus.BAD_REQUEST,
            )
        }

        // password dari data user ga sama loginDTO.password
        const isMatch = await bcrypt.compare(loginDTO.password, userOne.password);

        if(!isMatch){
            throw new HttpException (
                {
                    statusCode: HttpStatus.BAD_REQUEST,
                    error: 'password is invalid',
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        const payload = {
            id: userOne.id,
            username: userOne.username
        }

        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    } catch (e) {
        throw e
    }
   } 
}
