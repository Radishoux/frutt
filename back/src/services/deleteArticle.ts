import { Request, Response } from 'express';
import { OkPacket } from 'mysql2';
import pool from '../config/db';

export const deleteArticle = async (req: Request, res: Response): Promise<void> => {
  if (!req.params.id) {
    res.status(400).json({ error: 'Missing article ID' });
    return;
  }
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