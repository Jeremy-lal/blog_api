import { CreateArticleDto } from './dtos/create-article.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Article from '../typeorm/Article';

@Injectable()
export class ArticlesService {
    constructor(@InjectRepository(Article) private readonly articleRepository: Repository<Article>) { }

    findAll() {
        return this.articleRepository.find();
    }

    async findOne(id: number): Promise<Article> {
        const article = await this.articleRepository.findOne({ where: { id } });

        if (!article) throw new NotFoundException('Article not found');
        return article;
    }

    async findByUser(id: number): Promise<Article[]> {
        const articles = await this.articleRepository.find({ where: { author_id: id } });
        return articles;
    }

    async create(artcile: CreateArticleDto): Promise<Article> {
        const article = this.articleRepository.create(artcile);
        return await this.articleRepository.save(article);
    }

    async update(id: number, article: CreateArticleDto) {
        let articleDb = await this.articleRepository.findOne({ where: { id } });
        articleDb = { ...articleDb, ...article };
        if (!articleDb) throw new NotFoundException('Article not found');
        await this.articleRepository.save(articleDb);
    }

    async remove(id: number) {
        const article = await this.findOne(id)
        if (!article) {
            throw new NotFoundException('Article not found')
        }

        return this.articleRepository.remove(article);
    }
}
