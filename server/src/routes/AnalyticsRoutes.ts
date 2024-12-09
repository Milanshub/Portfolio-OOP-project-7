import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const analyticsController = new AnalyticsController();

// All routes are protected
router.use(authMiddleware);

router.get('/', analyticsController.getAnalytics.bind(analyticsController));
router.get('/latest', analyticsController.getLatestAnalytics.bind(analyticsController));
router.get('/report', analyticsController.getAnalyticsReport.bind(analyticsController));
router.post('/', analyticsController.createAnalytics.bind(analyticsController));
router.put('/:id', analyticsController.updateAnalytics.bind(analyticsController));

export const analyticsRoutes = router;