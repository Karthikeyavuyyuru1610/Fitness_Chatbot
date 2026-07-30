import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { generateDietPlan } from '../controllers/dietController.js';

const router = Router();

// Generate a diet / meal plan
router.post('/generate', asyncHandler(generateDietPlan));

export default router;
