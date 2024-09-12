import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { Article } from '../models/article';

type ArticleRow = Article & RowDataPacket;
type TagRow = { name: string } & RowDataPacket;

export const getArticleById = async (req: Request, res: Response): Promise<void> => {
  if (!req.params.id) {
    res.status(400).json({ error: 'Missing article ID' });
    return;
  }

  const { id } = req.params;
  try {
    const [articles] = await pool.query<ArticleRow[]>('SELECT * FROM articles WHERE id = ?', [id]);
    if (articles.length === 0) {
      res.status(404).json({ message: 'Article not found' });
      return
    }

    const [tags] = await pool.query<TagRow[]>(
      'SELECT name FROM tags INNER JOIN article_tags ON tags.id = article_tags.tag_id WHERE article_tags.article_id = ?',
      [id]
    );

    const article = {
      ...articles[0],
      tags: tags.map(tag => tag.name),
    };

    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve article' });
  }
};