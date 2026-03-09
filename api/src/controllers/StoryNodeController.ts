import { Request, Response } from 'express';
import { StoryNode } from '../models/story-node';
import { Story } from '../models/story';
import { AuthRequest } from '../middlewares/auth.middleware';

export class StoryNodeController {

  public async getNodesByStory(req: Request, res: Response): Promise<void> {
    try {
      const nodes = await StoryNode.find({ storyId: req.params.story_id });
      res.json({ status: 'success', message: 'Nodes retrieved', data: nodes });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error retrieving nodes' });
    }
  }

  public async createNode(req: AuthRequest, res: Response): Promise<void> {
    try {
      const story = await Story.findOne({ _id: req.params.story_id, author: req.userId });
      if (!story) {
        res.status(404).json({ status: 'error', message: 'Story not found or unauthorized' });
        return;
      }

      const node = new StoryNode({ ...req.body, storyId: story._id });
      const savedNode = await node.save();

      if (!story.startNodeId) {
        story.startNodeId = savedNode._id as any;
        await story.save();
      }

      res.status(201).json({ status: 'success', message: 'Node created', data: savedNode });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error creating node' });
    }
  }

  public async getNodeById(req: Request, res: Response): Promise<void> {
    try {
      const node = await StoryNode.findById(req.params.node_id);
      if (!node) {
        res.status(404).json({ status: 'error', message: 'Node not found' });
        return;
      }
      res.json({ status: 'success', message: 'Node retrieved', data: node });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error retrieving node' });
    }
  }

  public async updateNode(req: AuthRequest, res: Response): Promise<void> {
    try {
      const node = await StoryNode.findById(req.params.node_id);
      if (!node) {
        res.status(404).json({ status: 'error', message: 'Node not found' });
        return;
      }

      const story = await Story.findOne({ _id: node.storyId, author: req.userId });
      if (!story) {
        res.status(403).json({ status: 'error', message: 'Unauthorized' });
        return;
      }

      const updatedNode = await StoryNode.findByIdAndUpdate(req.params.node_id, req.body, { new: true });
      res.json({ status: 'success', message: 'Node updated', data: updatedNode });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error updating node' });
    }
  }

  public async deleteNode(req: AuthRequest, res: Response): Promise<void> {
    try {
      const node = await StoryNode.findById(req.params.node_id);
      if (!node) {
        res.status(404).json({ status: 'error', message: 'Node not found' });
        return;
      }

      const story = await Story.findOne({ _id: node.storyId, author: req.userId });
      if (!story) {
        res.status(403).json({ status: 'error', message: 'Unauthorized' });
        return;
      }

      await StoryNode.findByIdAndDelete(req.params.node_id);
      res.json({ status: 'success', message: 'Node deleted' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error deleting node' });
    }
  }
}
