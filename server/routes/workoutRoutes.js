import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { generateWorkoutPlan } from '../controllers/workoutController.js';

const router = Router();

// Generate a workout plan
router.post('/generate', asyncHandler(generateWorkoutPlan));

export default router;
