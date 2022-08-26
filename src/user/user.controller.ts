import { SignUpDto } from './dto/signup.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service'
import { User } from './user.entity';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }


    @Post('signup')
    signUp(
        @Body() signUpDto: SignUpDto
    ): Promise<User> {
        return this.userService.signUp(signUpDto)
    }
}
