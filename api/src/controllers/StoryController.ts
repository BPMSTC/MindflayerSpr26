import { Request, Response } from 'express';
import { Story } from '../models/story';
import { StoryNode } from '../models/story-node';
import { AuthRequest } from '../middlewares/auth.middleware';

export class StoryController {

  public async getAllStories(req: Request, res: Response): Promise<void> {
    try {
      const stories = await Story.find({}).populate('author', '-password');
      res.json({ status: 'success', message: 'Stories retrieved', data: stories });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error retrieving stories' });
    }
  }

  public async getPublishedStories(req: Request, res: Response): Promise<void> {
    try {
      const stories = await Story.find({ isPublished: true }).populate('author', '-password');
      res.json({ status: 'success', message: 'Published stories retrieved', data: stories });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error retrieving stories' });
    }
  }

  public async getMyStories(req: AuthRequest, res: Response): Promise<void> {
    try {
      const stories = await Story.find({ author: req.userId });
      res.json({ status: 'success', message: 'User stories retrieved', data: stories });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error retrieving stories' });
    }
  }

  public async createStory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const story = new Story({ ...req.body, author: req.userId });
      const savedStory = await story.save();
      res.status(201).json({ status: 'success', message: 'Story created', data: savedStory });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error creating story' });
    }
  }

  public async getStoryById(req: Request, res: Response): Promise<void> {
    try {
      const story = await Story.findById(req.params.story_id).populate('author', '-password');
      if (!story) {
        res.status(404).json({ status: 'error', message: 'Story not found' });
        return;
      }
      res.json({ status: 'success', message: 'Story retrieved', data: story });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error retrieving story' });
    }
  }

  public async updateStory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const story = await Story.findOneAndUpdate(
        { _id: req.params.story_id, author: req.userId },
        req.body,
        { new: true }
      );
      if (!story) {
        res.status(404).json({ status: 'error', message: 'Story not found or unauthorized' });
        return;
      }
      res.json({ status: 'success', message: 'Story updated', data: story });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error updating story' });
    }
  }

  public async deleteStory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const story = await Story.findOneAndDelete({ _id: req.params.story_id, author: req.userId });
      if (!story) {
        res.status(404).json({ status: 'error', message: 'Story not found or unauthorized' });
        return;
      }
      await StoryNode.deleteMany({ storyId: story._id });
      res.json({ status: 'success', message: 'Story and all nodes deleted' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error deleting story' });
    }
  }
}
