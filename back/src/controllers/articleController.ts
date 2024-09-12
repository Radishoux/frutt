import { Request, Response } from 'express';
import { RowDataPacket, OkPacket } from 'mysql2';
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

export const getArticleById = async (req: Request, res: Response): Promise<void> => {
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

export const createArticle = async (req: Request, res: Response): Promise<void> => {
  const { title, description, price, image, tags } = req.body;
  try {
    const [result] = await pool.query<OkPacket>(
      'INSERT INTO articles (title, description, price, image) VALUES (?, ?, ?, ?)',
      [title, description, price, image]
    );

    const articleId = result.insertId;

    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        const [tagResult] = await pool.query<OkPacket>(
          'INSERT IGNORE INTO tags (name) VALUES (?)',
          [tag]
        );

        const tagId = tagResult.insertId;
        await pool.query('INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)', [articleId, tagId]);
      }
    }

    res.status(201).json({ message: 'Article created', articleId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create article', message: error });
  }
};

export const updateArticle = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, description, price, image, tags } = req.body;

  try {
    const [result] = await pool.query<OkPacket>(
      'UPDATE articles SET title = ?, description = ?, price = ?, image = ? WHERE id = ?',
      [title, description, price, image, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Article not found' });
      return;
    }

    await pool.query('DELETE FROM article_tags WHERE article_id = ?', [id]);

    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        const [existingTag] = await pool.query<RowDataPacket[]>('SELECT id FROM tags WHERE name = ?', [tag]);

        let tagId;
        if (existingTag.length > 0) {
          tagId = existingTag[0].id;
        } else {
          const [tagResult] = await pool.query<OkPacket>(
            'INSERT INTO tags (name) VALUES (?)',
            [tag]
          );
          tagId = tagResult.insertId;
        }

        await pool.query('INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)', [id, tagId]);
      }
    }

    res.json({ message: 'Article updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update article' });
  }
};

export const deleteArticle = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const [result] = await pool.query<OkPacket>('DELETE FROM articles WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Article not found' });
      return
    }

    res.json({ message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
};