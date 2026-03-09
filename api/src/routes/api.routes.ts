import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { StoryController } from '../controllers/StoryController';
import { StoryNodeController } from '../controllers/StoryNodeController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();
const storyController = new StoryController();
const storyNodeController = new StoryNodeController();

// User routes
router.post('/user/authenticate', (req, res) => userController.authenticate(req, res));
router.post('/users', (req, res) => userController.createUser(req, res));
router.get('/users', authMiddleware, (req, res) => userController.getAllUsers(req, res));
router.get('/user/:user_id', authMiddleware, (req, res) => userController.getUserById(req, res));
router.put('/user/:user_id', authMiddleware, (req, res) => userController.updateUser(req, res));
router.delete('/user/:user_id', authMiddleware, (req, res) => userController.deleteUser(req, res));

// Story routes
router.get('/stories', authMiddleware, (req, res) => storyController.getAllStories(req, res));
router.get('/stories/published', (req, res) => storyController.getPublishedStories(req, res));
router.get('/stories/mine', authMiddleware, (req, res) => storyController.getMyStories(req, res));
router.post('/stories', authMiddleware, (req, res) => storyController.createStory(req, res));
router.get('/story/:story_id', (req, res) => storyController.getStoryById(req, res));
router.put('/story/:story_id', authMiddleware, (req, res) => storyController.updateStory(req, res));
router.delete('/story/:story_id', authMiddleware, (req, res) => storyController.deleteStory(req, res));

// Story node routes
router.get('/story/:story_id/nodes', (req, res) => storyNodeController.getNodesByStory(req, res));
router.post('/story/:story_id/nodes', authMiddleware, (req, res) => storyNodeController.createNode(req, res));
router.get('/node/:node_id', (req, res) => storyNodeController.getNodeById(req, res));
router.put('/node/:node_id', authMiddleware, (req, res) => storyNodeController.updateNode(req, res));
router.delete('/node/:node_id', authMiddleware, (req, res) => storyNodeController.deleteNode(req, res));

export default router;
