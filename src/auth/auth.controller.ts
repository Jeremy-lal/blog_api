import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { GetCurrentUser, GetCurrentUserId } from '../common/decorators';
import { AuthService } from './auth.service';
import CreateUserDto from './dtos/create-user.dto';
import { Tokens } from './types/tokens';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('local/signup')
    @HttpCode(HttpStatus.CREATED)
    signupLocal(@Body() createUserDto: CreateUserDto): Promise<Tokens> {
        return this.authService.signupLocal(createUserDto);
    }

    @Post('local/signin')
    @HttpCode(HttpStatus.OK)
    signinLocal(@Body() createUserDto: CreateUserDto) {
        return this.authService.signinLocal(createUserDto);
    }

    // @UseGuards(AtGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUserId() userId: number) {
        return this.authService.logout(userId);
    }

    // @UseGuards(RtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@GetCurrentUserId() userId: number, @GetCurrentUser('refreshToken') refreshToken: string) {
        return this.authService.refreshTokens(userId, refreshToken);
    }
}
