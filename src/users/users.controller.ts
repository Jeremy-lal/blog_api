import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { Controller, Delete, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AtGuard } from '../common/guards';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @UseGuards(AtGuard)
    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Delete('/:id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.userService.remove(id);
    }
}
