import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, Param, ParseIntPipe, UnauthorizedException, UseGuards } from '@nestjs/common';
import { GetCurrentUser, GetCurrentUserId } from '../common/decorators';
import { AuthService } from './auth.service';
import CreateUserDto from './dtos/create-user.dto';
import { Tokens } from './types/tokens';
import { Response, Request } from 'express';
import { AtGuard } from '../common/guards';

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
    async signinLocal(@Body() user: { username: string, password: string },
        @Res({ passthrough: true }) response: Response
    ) {
        const result = await this.authService.signinLocal(user);
        response.cookie('jwt', result.tokens.refresh_token, { httpOnly: true, secure: true }); //  domain: 'http://localhost:3000',

        response.send({ ...result.user, token: result.tokens.access_token });
    }

    @UseGuards(AtGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUserId() userId: number) {
        return this.authService.logout(userId);
    }

    // @UseGuards(RtGuard)
    // @Post('refresh')
    // @HttpCode(HttpStatus.OK)
    // refreshTokens(@GetCurrentUserId() userId: number, @GetCurrentUser('refreshToken') refreshToken: string) {
    //     return this.authService.refreshTokens(userId, refreshToken);
    // }
    @Get('refresh/:id')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@Param('id', ParseIntPipe) id: number, @Req() request: Request,) {
        if (!request.cookies.jwt) {
            return new UnauthorizedException('Unauthorized');
        }

        return this.authService.refreshTokens(id, request.cookies.jwt);
    }

}
