import { Router } from 'express';
import { GitHubController } from '../controllers/GitHubController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

export const router = Router();
const githubController = new GitHubController();

router.get('/repositories', authenticate, requireAdmin, githubController.getRepositories.bind(githubController));
router.get('/repository/:name', authenticate, requireAdmin, githubController.getRepository.bind(githubController));
router.get('/repository/:name/commits', authenticate, requireAdmin, githubController.getCommits.bind(githubController));