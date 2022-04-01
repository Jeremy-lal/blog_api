import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import Article from '../typeorm/Article';

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  providers: [
    ArticlesService
  ],
  controllers: [ArticlesController]
})
export class ArticlesModule {

}
