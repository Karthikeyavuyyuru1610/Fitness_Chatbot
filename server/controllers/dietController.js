import { generateDiet } from '../services/geminiService.js';

/**
 * POST /api/diet/generate
 * Generates a personalized diet / meal plan based on user preferences.
 */
const generateDietPlan = async (req, res) => {
  const { dietType, goal, allergies, mealsPerDay, calories } = req.body;

  // Validate required fields
  if (!dietType || !goal) {
    return res.status(400).json({
      success: false,
      error: { message: 'dietType and goal are required' },
    });
  }

  const plan = await generateDiet({
    dietType,
    goal,
    allergies: allergies || 'None',
    mealsPerDay: mealsPerDay || 3,
    calories: calories || null,
  });

  res.json({ success: true, data: { plan } });
};

export { generateDietPlan };
