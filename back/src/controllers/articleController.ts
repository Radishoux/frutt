import { Request, Response } from 'express';
import { RowDataPacket, OkPacket } from 'mysql2';
import pool from '../config/db';
import { Article } from '../models/article';
import { getAllArticles as getAllArticlesService } from '../services/getAllArticles';
import { getArticleById as getArticleByIdService } from '../services/getArticleById';
import { createArticle as createArticleService } from '../services/createArticle';
import { updateArticle as updateArticleService } from '../services/updateArticle';
import { deleteArticle as deleteArticleService } from '../services/deleteArticle';

type ArticleRow = Article & RowDataPacket;
type TagRow = { name: string } & RowDataPacket;

export const getAllArticles = async (req: Request, res: Response) => {
  try {
    await getAllArticlesService(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve articles' });
  }
};

export const getArticleById = async (req: Request, res: Response): Promise<void> => {
  try {
    await getArticleByIdService(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve article' });
  }
};

export const createArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    await createArticleService(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create article', message: error });
  }
};

export const updateArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    await updateArticleService(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update article' });
  }
};

export const deleteArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    await deleteArticleService(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
};