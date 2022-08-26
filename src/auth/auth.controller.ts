import { AuthService } from './auth.service';
import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local/local-auth.guards';
import { JwtAuthGuard } from './jwt/jwt-auth.guards';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}
    

    //useguard ดรียก stratigy เพื่อตรวจสอบ ทุกครั้งที่ยิง requestมา
    @UseGuards(LocalAuthGuard)
    @Post('signin')
    signIn(
        @Request() req: any
    ): Promise<any> {
        return this.authService.signIn(req.user)
    }


    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req:any): Promise<any>{
        return req.user
    }
}
