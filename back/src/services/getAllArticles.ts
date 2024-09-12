import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { Article } from '../models/article';

type ArticleRow = Article & RowDataPacket;
type TagRow = { name: string } & RowDataPacket;

export const getAllArticles = async (req: Request, res: Response) => {
  try {
    const [articles] = await pool.query<ArticleRow[]>('SELECT * FROM articles');

    const articlesWithTags = await Promise.all(
      articles.map(async (article) => {
        const [tags] = await pool.query<TagRow[]>(
          'SELECT name FROM tags INNER JOIN article_tags ON tags.id = article_tags.tag_id WHERE article_tags.article_id = ?',
          [article.id]
        );

        return {
          ...article,
          tags: tags.map(tag => tag.name),
        };
      })
    );

    res.json(articlesWithTags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve articles' });
  }
};
