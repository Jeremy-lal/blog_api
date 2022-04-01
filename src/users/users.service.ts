import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../typeorm/User';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

    findAll() {
        return this.userRepository.find();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    findByUsername(username: string) {
        return this.userRepository.find({ where: { username } });
    }

}
