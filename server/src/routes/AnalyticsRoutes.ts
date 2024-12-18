import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

export const router = Router();
const analyticsController = new AnalyticsController();

router.get('/', authenticate, requireAdmin, analyticsController.getAnalytics.bind(analyticsController));
router.get('/latest', authenticate, requireAdmin, analyticsController.getLatestAnalytics.bind(analyticsController));
router.get('/report', authenticate, requireAdmin, analyticsController.generateAnalyticsReport.bind(analyticsController));
router.post('/', authenticate, requireAdmin, analyticsController.createAnalytics.bind(analyticsController));
router.put('/:id', authenticate, requireAdmin, analyticsController.updateAnalytics.bind(analyticsController));
router.delete('/:id', authenticate, requireAdmin, analyticsController.deleteAnalytics.bind(analyticsController));
router.post('/pageview', analyticsController.recordPageView.bind(analyticsController));
router.put('/most-viewed-projects', authenticate, requireAdmin, analyticsController.updateMostViewedProjects.bind(analyticsController));