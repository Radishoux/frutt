import { Request, Response } from 'express';
import pool from '../config/db';
import { Article } from '../models/article';

// Define a custom type for query results
type QueryResult<T> = [T[], any];

export const getAllArticles = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<QueryResult<Article>>('SELECT * FROM articles');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve articles' });
  }
};

export const getArticleById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query<QueryResult<Article>>('SELECT * FROM articles WHERE id = ?', [id]);
    if (!rows || rows.length < 1) return res.status(404).json({ message: 'Article not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve article' });
  }
};

export const createArticle = async (req: Request, res: Response) => {
  const { title, description, price } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO articles (title, description, price) VALUES (?, ?, ?)', [title, description, price]);
    res.status(201).json({ message: 'Article created', articleId: (result as any).insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create article' });
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, price } = req.body;
  try {
    const [result] = await pool.query('UPDATE articles SET title = ?, description = ?, price = ? WHERE id = ?', [title, description, price, id]);
    if ((result as any).affectedRows === 0) return res.status(404).json({ message: 'Article not found' });
    res.json({ message: 'Article updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update article' });
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM articles WHERE id = ?', [id]);
    if ((result as any).affectedRows === 0) return res.status(404).json({ message: 'Article not found' });
    res.json({ message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
};
