import { UsersService } from './users.service';
import { Controller, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Delete('/:id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.userService.remove(id);
    }
}
