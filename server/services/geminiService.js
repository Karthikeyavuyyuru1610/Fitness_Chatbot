import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Intelligent Local AI Engine for FitBot.
 * If GEMINI_API_KEY is missing, placeholder, or invalid, or if API network calls fail,
 * FitBot falls back to this rule-based and template-driven local AI generator.
 */

// Initialize Gemini if API key is provided and not placeholder
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } catch (e) {
    console.warn('⚠️ Gemini client initialization failed, using local AI engine');
  }
}

const SYSTEM_INSTRUCTION = `You are FitBot, an expert AI fitness coach and nutritionist. You provide:
- Evidence-based fitness advice
- Personalized workout plans
- Nutrition and diet recommendations
- Motivation and encouragement`;

const getModel = () => {
  if (!genAI) return null;
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
  });
};

/**
 * Local AI Chat response generator for offline / fallback mode.
 */
const getLocalChatResponse = (prompt, context = []) => {
  const p = prompt.toLowerCase();

  let contextNote = '';
  if (context.length > 0) {
    contextNote = `*(Referencing your earlier notes: "${context[0].substring(0, 60)}...")*\n\n`;
  }

  if (p.includes('muscle') || p.includes('build') || p.includes('hypertrophy') || p.includes('pack') || p.includes('abs') || p.includes('chest') || p.includes('bicep')) {
    return `${contextNote}### 🏋️ Muscle Building & Hypertrophy Strategy

To effectively build muscle and develop definition, focus on these 4 core pillars:

#### 1. Progressive Overload
- Increase weight, reps, or decrease rest time progressively week by week.
- Aim for 3–5 compound exercises per session (Squats, Deadlifts, Bench Press, Rows, Overhead Press).
- Target **8 to 12 reps** per set with 90–120 seconds rest.

#### 2. Nutrition & Protein Intake
- Eat in a slight **caloric surplus** (+250 to +500 kcal/day).
- Consume **1.6g – 2.2g of protein per kg** of body weight daily.
- Quality protein sources: Chicken breast, eggs, Greek yogurt, fish, whey, lentils, and tofu.

#### 3. Core & Abs (for 6-Pack)
- Abs are revealed through low body fat (**<12% for men, <20% for women**).
- Train abs 2–3 times a week with Weighted Crunches, Hanging Leg Raises, and Planks.

#### 4. Recovery & Sleep
- Muscle grows during sleep! Aim for **7–9 hours** of quality sleep every night.
- Allow 48 hours of recovery between training the same muscle group.`;
  }

  if (p.includes('cardio') || p.includes('run') || p.includes('fat loss') || p.includes('stamina') || p.includes('endurance')) {
    return `${contextNote}### 🏃 Cardio & Endurance Guidelines

Cardio is essential for heart health, stamina, and calorie expenditure:

#### High-Intensity Interval Training (HIIT)
- **Structure:** 30 sec sprint / max effort, followed by 60 sec walking/rest.
- **Duration:** 15–20 minutes, 2–3 times a week.
- **Benefits:** Maximizes calorie burn in short duration and preserves muscle mass.

#### Low-Intensity Steady State (LISS)
- **Activities:** Brisk walking, cycling, light jogging, swimming.
- **Duration:** 30–45 minutes at 60-70% max heart rate.
- **Benefits:** Great for active recovery and fat oxidation without heavy central nervous system fatigue.

#### Pro Tip
Combine strength training (3-4x/week) with 20 minutes of post-workout cardio for optimal body composition!`;
  }

  if (p.includes('protein') || p.includes('diet') || p.includes('meal') || p.includes('nutrition') || p.includes('food') || p.includes('eat')) {
    return `${contextNote}### 🥗 Nutrition & Protein Breakdown

#### Daily Protein Calculator
- **Maintenance / Light Active:** 1.2g – 1.6g per kg bodyweight.
- **Muscle Growth / Fat Loss:** 1.6g – 2.2g per kg bodyweight.

#### Top High-Protein Foods
| Food Source | Serving Size | Protein (g) |
|---|---|---|
| Chicken Breast | 100g | 31g |
| Eggs | 2 large | 12g |
| Greek Yogurt | 170g | 17g |
| Cottage Cheese | 100g | 11g |
| Salmon / Tuna | 100g | 22–25g |
| Tofu / Tempeh | 100g | 15–19g |
| Whey Protein | 1 scoop | 24–25g |

#### Key Takeaway
Distribute your protein intake evenly across **3–5 meals** throughout the day for maximum muscle protein synthesis!`;
  }

  if (p.includes('recovery') || p.includes('sore') || p.includes('rest') || p.includes('sleep')) {
    return `${contextNote}### 😴 Post-Workout Recovery Protocol

1. **Post-Workout Hydration:** Drink 500-750ml water mixed with electrolytes immediately after training.
2. **Post-Workout Meal:** Eat a balanced meal with protein & carbs within 1–2 hours.
3. **Active Recovery:** Light walking, foam rolling, and mobility work reduce DOMS (Delayed Onset Muscle Soreness).
4. **Sleep:** Aim for 8 hours of uninterrupted sleep for peak human growth hormone (HGH) release.`;
  }

  return `${contextNote}### 🏋️ FitBot Health & Fitness Advice

Thank you for asking about **"${prompt}"**! Here are expert recommendations for your journey:

- **Consistency over Intensity:** 3 to 4 focused workouts per week will beat sporadic 2-hour gym marathons.
- **Prioritize Form:** Always master exercise technique before adding heavy weights to avoid injury.
- **Track Progress:** Keep a log of your weights, reps, and nutrition to ensure continuous improvement.
- **Balanced Lifestyle:** Balance your workouts with adequate hydration (3+ liters of water daily) and whole foods.

Feel free to ask me for a custom **Workout Plan**, **Diet Plan**, or calculate your **BMI** using the navigation menu!`;
};

/**
 * Sends a chat message — tries Gemini API first, falls back to local AI engine.
 */
const chat = async (prompt, context = []) => {
  try {
    const model = getModel();
    if (model) {
      let enhancedPrompt = prompt;
      if (context.length > 0) {
        enhancedPrompt = `Previous relevant context:\n${context.join('\n')}\n\nCurrent question: ${prompt}`;
      }
      const result = await model.generateContent(enhancedPrompt);
      return result.response.text();
    }
  } catch (error) {
    console.warn('⚠️ Gemini API request failed. Using local response engine.');
  }

  return getLocalChatResponse(prompt, context);
};

/**
 * Generates a structured workout plan.
 */
const generateWorkout = async ({ fitnessLevel, goal, equipment, daysPerWeek, duration }) => {
  try {
    const model = getModel();
    if (model) {
      const prompt = `Generate a detailed, structured weekly workout plan with:
- Fitness Level: ${fitnessLevel}
- Goal: ${goal}
- Available Equipment: ${equipment}
- Days Per Week: ${daysPerWeek}
- Session Duration: ${duration} minutes

Include weekly schedule, exercises with sets/reps, warm-up/cool-down, and progressive overload in markdown.`;

      const result = await model.generateContent(prompt);
      return result.response.text();
    }
  } catch (error) {
    console.warn('⚠️ Gemini API workout generation failed. Using local plan engine.');
  }

  // Local Plan Generator
  const levelTitle = fitnessLevel.charAt(0).toUpperCase() + fitnessLevel.slice(1);
  const equip = equipment || 'Bodyweight & Dumbbells';

  return `### 🏋️ Custom ${levelTitle} Workout Plan

**Goal:** ${goal}  
**Equipment:** ${equip}  
**Schedule:** ${daysPerWeek} Days / Week (${duration} mins / session)  

---

#### 📅 Weekly Schedule Breakdown

| Day | Workout Focus | Main Exercises | Target Duration |
|---|---|---|---|
| **Day 1** | Push (Chest, Shoulders, Triceps) | Bench Press / Push-ups, Overhead Press, Tricep Dips | ${duration} mins |
| **Day 2** | Pull (Back, Biceps, Rear Delts) | Lat Pulldowns / Pull-ups, Bent-over Rows, Bicep Curls | ${duration} mins |
| **Day 3** | Rest / Active Recovery | Light walking, stretching, mobility work | 20–30 mins |
| **Day 4** | Legs & Core | Squats, Romanian Deadlifts, Lunges, Planks | ${duration} mins |
${daysPerWeek >= 5 ? `| **Day 5** | Upper Body Strength | Incline Dumbbell Press, Dumbbell Rows, Lateral Raises | ${duration} mins |\n` : ''}${daysPerWeek >= 6 ? `| **Day 6** | Lower Body & HIIT | Bulgarian Split Squats, Calf Raises, 15-min HIIT | ${duration} mins |\n` : ''}| **Rest** | Full Rest & Recovery | Rest, hydration, sleep focus | - |

---

#### 💡 Daily Routine Details

##### Warm-up (5–8 mins)
- 3 mins Jumping Jacks or Light Jogging
- Arm circles, Hip openers, Dynamic Cat-Cow stretches

##### Core Workout Structure
1. **Primary Compound Exercise:** 4 sets x 8–10 reps (2 mins rest)
2. **Secondary Exercise:** 3 sets x 10–12 reps (90s rest)
3. **Accessory Movement:** 3 sets x 12–15 reps (60s rest)
4. **Core Finishing Movement:** 3 sets x 15–20 reps or 60s Plank

##### Cool-down (5 mins)
- Static hamstring stretch, Quad stretch, Child's pose hold (30s each).

---

#### 📈 Progressive Overload Rules
1. Increase weight by 2.5% – 5% once you can hit the maximum reps for all sets with clean form.
2. Focus on tempo: 2 seconds down (eccentric), 1 second pause, 1 second up (concentric).`;
};

/**
 * Generates a personalized diet / meal plan.
 */
const generateDiet = async ({ dietType, goal, allergies, mealsPerDay, calories }) => {
  try {
    const model = getModel();
    if (model) {
      const prompt = `Generate a detailed daily meal plan with:
- Diet Type: ${dietType}
- Goal: ${goal}
- Allergies: ${allergies || 'None'}
- Meals Per Day: ${mealsPerDay}
${calories ? `- Target Calories: ${calories} kcal` : ''}

Include daily meals with portions, macros, grocery list, and prep tips in markdown tables.`;

      const result = await model.generateContent(prompt);
      return result.response.text();
    }
  } catch (error) {
    console.warn('⚠️ Gemini API diet generation failed. Using local meal plan engine.');
  }

  // Local Diet Plan Generator
  const targetCals = calories || 2200;
  const proteinGrams = Math.round((targetCals * 0.3) / 4);
  const carbsGrams = Math.round((targetCals * 0.4) / 4);
  const fatGrams = Math.round((targetCals * 0.3) / 9);

  return `### 🥗 Customized ${dietType.toUpperCase()} Meal Plan

**Goal:** ${goal}  
**Target Calories:** ~${targetCals} kcal / day  
**Allergies / Exclusions:** ${allergies || 'None'}  

---

#### 📊 Macro Breakdown Summary

| Nutrient | Daily Target | % of Total Calories |
|---|---|---|
| **Protein** | ${proteinGrams}g | 30% |
| **Carbohydrates** | ${carbsGrams}g | 40% |
| **Fats** | ${fatGrams}g | 30% |
| **Total Energy** | **${targetCals} kcal** | 100% |

---

#### 🍳 Daily Meal Schedule (${mealsPerDay} Meals)

| Meal | Recommended Menu | Est. Macros (P / C / F) |
|---|---|---|
| **Meal 1: Breakfast** | Oatmeal cooked with almond milk, topped with berries, chia seeds, and 1 scoop protein powder / 3 scrambled egg whites. | ~35g P / 45g C / 10g F |
| **Meal 2: Lunch** | Grilled protein (${dietType === 'vegetarian' || dietType === 'vegan' ? 'Tofu/Paneer' : 'Chicken breast'}) with quinoa/brown rice, steamed broccoli, and olive oil drizzle. | ~45g P / 50g C / 14g F |
${mealsPerDay >= 4 ? `| **Meal 3: Afternoon Snack** | Greek yogurt or Hummus with sliced cucumbers, carrots, and a handful of almonds. | ~18g P / 20g C / 12g F |\n` : ''}| **Meal ${mealsPerDay >= 4 ? 4 : 3}: Dinner** | Baked Salmon / Tempeh with roasted sweet potatoes, mixed green salad, and avocado slices. | ~40g P / 35g C / 18g F |

---

#### 🛒 Essential Grocery List
- **Protein:** Eggs/White-whites, Chicken breast / Tofu / Cottage cheese, Whey or Plant protein powder.
- **Carbs:** Rolled oats, Quinoa, Brown rice, Sweet potatoes, Berries, Apples.
- **Healthy Fats:** Extra virgin olive oil, Avocado, Raw almonds, Chia/Flax seeds.
- **Veggies:** Spinach, Broccoli, Asparagus, Bell peppers, Cucumber.

---

#### 💡 Prep & Success Tips
1. **Hydration:** Drink at least 3 Liters of fresh water throughout the day.
2. **Batch Cooking:** Prepare your grains and protein sources in bulk every 3 days.
3. **Seasoning:** Use spices, lemon juice, garlic, and herbs liberally to add flavor without excess calories!`;
};

export { chat, generateWorkout, generateDiet };
