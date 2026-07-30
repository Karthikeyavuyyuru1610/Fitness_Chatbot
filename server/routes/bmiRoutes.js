import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { calculateBMI } from '../controllers/bmiController.js';

const router = Router();

// Calculate BMI and daily calorie requirements
router.post('/calculate', asyncHandler(calculateBMI));

export default router;
