import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { env } from '../config/env';
import { AuthRequest } from '../middlewares/auth.middleware';

export class UserController {

  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find({}).select('-password');
      res.json({ status: 'success', message: 'Users retrieved', data: users });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error retrieving users' });
    }
  }

  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, firstName, lastName, email } = req.body;

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        res.status(400).json({ status: 'error', message: 'Username already exists' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword, firstName, lastName, email });
      const savedUser = await user.save();

      const userResponse = savedUser.toObject();
      delete (userResponse as any).password;
      res.status(201).json({ status: 'success', message: 'User created', data: userResponse });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error creating user' });
    }
  }

  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findById(req.params.user_id).select('-password');
      if (!user) {
        res.status(404).json({ status: 'error', message: 'User not found' });
        return;
      }
      res.json({ status: 'success', message: 'User retrieved', data: user });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error retrieving user' });
    }
  }

  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findByIdAndUpdate(req.params.user_id, req.body, { new: true }).select('-password');
      if (!user) {
        res.status(404).json({ status: 'error', message: 'User not found' });
        return;
      }
      res.json({ status: 'success', message: 'User updated', data: user });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error updating user' });
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findByIdAndDelete(req.params.user_id);
      if (!user) {
        res.status(404).json({ status: 'error', message: 'User not found' });
        return;
      }
      res.json({ status: 'success', message: 'User deleted' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error deleting user' });
    }
  }

  public async authenticate(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign({ id: user._id }, env.secret, { algorithm: 'HS256' });
      user.token = token;
      await user.save();

      const userResponse = user.toObject();
      delete (userResponse as any).password;
      res.json({ status: 'success', message: 'Authenticated', data: userResponse });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error authenticating' });
    }
  }
}
