import { generateWorkout } from '../services/geminiService.js';

/**
 * POST /api/workout/generate
 * Generates a personalized workout plan based on user parameters.
 */
const generateWorkoutPlan = async (req, res) => {
  const { fitnessLevel, goal, equipment, daysPerWeek, duration } = req.body;

  // Validate required fields
  if (!fitnessLevel || !goal) {
    return res.status(400).json({
      success: false,
      error: { message: 'fitnessLevel and goal are required' },
    });
  }

  const plan = await generateWorkout({
    fitnessLevel,
    goal,
    equipment: equipment || 'bodyweight only',
    daysPerWeek: daysPerWeek || 3,
    duration: duration || 45,
  });

  res.json({ success: true, data: { plan } });
};

export { generateWorkoutPlan };
