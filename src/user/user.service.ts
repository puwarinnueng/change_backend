import { UserRepository } from './user.repository';
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt'
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(

        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) { }

    async signUp(signUpDto: SignUpDto): Promise<User> {
        try {
            const {
                username,
                password,
            } = signUpDto

            //hash password
            const hashPassword = await bcrypt.hashSync(password, 10);

            const user = this.userRepository.create({
                username,
                password: hashPassword,
            })

            //save to database
            return await this.userRepository.save(user)
        } catch {
            throw new ConflictException({
                message: "username using"
            })
        }
    }



    async findOneUser(username: string): Promise<User | undefined>{
        const user = await this.userRepository.findOne({ where: {username}
        })
        return user
    }


}
