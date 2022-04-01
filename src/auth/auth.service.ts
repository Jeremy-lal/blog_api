import { Tokens } from './types/tokens';
import { ForbiddenException, Injectable } from '@nestjs/common';
import CreateUserDto from './dtos/create-user.dto';
import { hash, verify } from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../typeorm/User';
import { IsNull, Not, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>, private jwtService: JwtService) { }

    async signupLocal(createUserDto: CreateUserDto): Promise<Tokens> {
        createUserDto.password = await this.hashData(createUserDto.password);

        const user = this.userRepository.create({ ...createUserDto, role: 'user' });
        await this.userRepository.save(user);

        const tokens = await this.getTokens(user.id, user.username);
        this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }

    async signinLocal(createUserDto: CreateUserDto): Promise<Tokens> {
        const user = await this.userRepository.findOne({ where: { username: createUserDto.username } })

        if (!user) {
            throw new ForbiddenException('Invalid credentials');
        }

        const passwordMatch = await verify(user.password, createUserDto.password);

        if (!passwordMatch) {
            throw new ForbiddenException('Invalid credentials');
        }

        const tokens = await this.getTokens(user.id, user.username);
        this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }

    async logout(userId: number) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
                hashedRt: Not(IsNull())
            }
        });

        if (user) {
            user.hashedRt = null;
            await this.userRepository.save(user);
        }
    }

    async refreshTokens(userId: number, rt: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user || !user.hashedRt) {
            throw new ForbiddenException('Acces denied');
        }

        const rtMatches = await verify(user.hashedRt, rt);

        if (!rtMatches) {
            throw new ForbiddenException('Acces denied');
        }

        const tokens = await this.getTokens(user.id, user.username);
        this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }

    async updateRtHash(userId: number, rtHash: string) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId
            }
        });

        user.hashedRt = await this.hashData(rtHash);
        await this.userRepository.save(user);
    }

    async getTokens(userId: number, username: string) {
        const [at, rt] = await Promise.all([
            this.jwtService.sign({
                sub: userId,
                username
            }, {
                secret: 'at-scret-key',
                expiresIn: '15m'
            }),
            this.jwtService.sign({
                sub: userId,
                username
            }, {
                secret: 'rt-scret-key',
                expiresIn: 60 * 60 * 24 * 7
            })
        ])

        return {
            access_token: at,
            refresh_token: rt
        }
    }

    hashData(value: string) {
        return hash(value);
    }
}
