/**
 * POST /api/bmi/calculate
 * Calculates BMI, BMI category, daily calorie needs (Mifflin-St Jeor),
 * and a macro-nutrient split. Pure calculation — no AI call.
 */
const calculateBMI = (req, res) => {
  const { weight, height, age, gender, activityLevel } = req.body;

  // ── Validation ─────────────────────────────────────────────────────
  if (!weight || !height || !age || !gender) {
    return res.status(400).json({
      success: false,
      error: { message: 'weight (kg), height (cm), age, and gender are required' },
    });
  }

  const w = parseFloat(weight);
  const h = parseFloat(height);
  const a = parseInt(age, 10);

  if (isNaN(w) || isNaN(h) || isNaN(a) || w <= 0 || h <= 0 || a <= 0) {
    return res.status(400).json({
      success: false,
      error: { message: 'weight, height, and age must be positive numbers' },
    });
  }

  // ── BMI ────────────────────────────────────────────────────────────
  const heightM = h / 100;
  const bmi = w / (heightM * heightM);

  let category;
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal weight';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';

  // ── BMR (Mifflin-St Jeor) ─────────────────────────────────────────
  let bmr;
  if (gender.toLowerCase() === 'male') {
    bmr = 10 * w + 6.25 * h - 5 * a + 5;
  } else {
    bmr = 10 * w + 6.25 * h - 5 * a - 161;
  }

  // ── Activity multiplier ───────────────────────────────────────────
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very active': 1.9,
  };
  const multiplier = multipliers[(activityLevel || 'moderate').toLowerCase()] || 1.55;
  const dailyCalories = Math.round(bmr * multiplier);

  // ── Macros (balanced split) ───────────────────────────────────────
  const macros = {
    protein: { grams: Math.round((dailyCalories * 0.3) / 4), percentage: 30 },
    carbs:   { grams: Math.round((dailyCalories * 0.4) / 4), percentage: 40 },
    fat:     { grams: Math.round((dailyCalories * 0.3) / 9), percentage: 30 },
  };

  // ── Recommendations ───────────────────────────────────────────────
  const recommendations = [];
  if (category === 'Underweight') {
    recommendations.push(
      'Consider increasing calorie intake with nutrient-dense foods.',
      'Focus on strength training to build muscle mass.',
      'Consult a healthcare professional for a personalized plan.'
    );
  } else if (category === 'Normal weight') {
    recommendations.push(
      'Maintain your current healthy lifestyle!',
      'Focus on balanced nutrition and regular exercise.',
      'Aim for 150 minutes of moderate exercise per week.'
    );
  } else if (category === 'Overweight') {
    recommendations.push(
      'Consider a modest calorie deficit of 300–500 kcal/day.',
      'Increase cardiovascular exercise and strength training.',
      'Focus on whole foods and reduce processed food intake.'
    );
  } else {
    recommendations.push(
      'Consult a healthcare professional before starting a new program.',
      'Start with low-impact exercises like walking or swimming.',
      'Focus on sustainable, gradual lifestyle changes.'
    );
  }

  res.json({
    success: true,
    data: {
      bmi: parseFloat(bmi.toFixed(1)),
      category,
      bmr: Math.round(bmr),
      dailyCalories,
      macros,
      recommendations,
    },
  });
};

export { calculateBMI };
