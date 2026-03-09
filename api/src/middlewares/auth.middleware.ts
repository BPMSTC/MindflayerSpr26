import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : (req.query.token as string);

  if (!token) {
    res.status(401).json({ status: 'error', message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.secret) as { id: string };
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
};
