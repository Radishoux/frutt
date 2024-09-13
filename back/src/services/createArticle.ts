import { Request, Response } from 'express';
import { OkPacket } from 'mysql2';
import pool from '../config/db';

export const createArticle = async (req: Request, res: Response): Promise<void> => {
  const { title, description, price, image} = req.body;
  if (!title || !description || !price || !image) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  if (price <= 0) {
    res.status(400).json({ error: 'Price must be greater than 0' });
    return;
  }
  const imageBuffer = Buffer.from(image, 'base64');
  if (imageBuffer.length > 50 * 1024) {
    res.status(400).json({ error: 'Image size must be smaller than 50KB' });
    return;
  }
  try {
    const [result] = await pool.query<OkPacket>(
      'INSERT INTO articles (title, description, price, image) VALUES (?, ?, ?, ?)',
      [title, description, price, image]
    );

    const articleId = result.insertId;

    res.status(201).json({ message: 'Article created', articleId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create article', message: error });
  }
};
