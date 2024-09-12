import { Request, Response } from 'express';
import { RowDataPacket, OkPacket } from 'mysql2';
import pool from '../config/db';

export const updateArticle = async (req: Request, res: Response): Promise<void> => {
  if (!req.params.id) {
    res.status(400).json({ error: 'Missing article ID' });
    return;
  }
  if (!req.body.title || !req.body.description || !req.body.price || !req.body.image) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  if (typeof req.body.price !== 'number' || !/^\d+(\.\d{1,2})?$/.test(req.body.price.toString())) {
    res.status(400).json({ error: 'Price must be a number with a maximum of 2 decimal places' });
    return;
  }
  if (req.body.price <= 0) {
    res.status(400).json({ error: 'Price must be greater than 0' });
    return;
  }

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
