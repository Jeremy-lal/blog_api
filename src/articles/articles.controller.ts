import { CreateArticleDto } from './dtos/create-article.dto';
import { ArticlesService } from './articles.service';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';

@Controller('articles')
export class ArticlesController {
    constructor(private articlesService: ArticlesService) { }

    @Get()
    findAll() {
        return this.articlesService.findAll()
    }

    @Get('/:id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.articlesService.findOne(id)
    }

    @Post()
    create(@Body() article: CreateArticleDto) {
        return this.articlesService.create(article)
    }

    @Patch('/:id')
    update(@Param('id', ParseIntPipe) id: number, @Body() article: CreateArticleDto) {
        return this.articlesService.update(id, article)
    }

    @Delete('/:id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.articlesService.remove(id)
    }
}
