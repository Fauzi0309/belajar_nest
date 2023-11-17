import { Body, Controller, Get, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ResgisterDTO } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}
    
    @Post('/register')
    async register(@Body() registerDTO: ResgisterDTO){
        const data = await this.authService.register(registerDTO)

        return {
            data,
            statusCode: HttpStatus.OK,
            message: "success"
        }
    }

    @Post('/login')
    async login(@Body() loginDTO: LoginDTO){
        const data = await this.authService.login(loginDTO)

        return {
            data,
            statusCode: HttpStatus.OK,
            message: "success"
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/profile')
    async profile(@Req() req){
        return req.user
    }
}
