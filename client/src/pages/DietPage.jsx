import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateDiet } from '../services/api';
import Loader from '../components/Loader';

export default function DietPage() {
  const [form, setForm] = useState({
    dietType: 'balanced',
    goal: '',
    allergies: '',
    mealsPerDay: 3,
    calories: '',
  });
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'mealsPerDay' ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.goal.trim()) return;

    setLoading(true);
    setError('');
    setPlan('');

    try {
      const { data } = await generateDiet({
        ...form,
        calories: form.calories ? Number(form.calories) : undefined,
      });
      if (data.success) setPlan(data.data.plan);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to generate diet plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const DIET_TYPES = [
    { value: 'balanced', label: '⚖️ Balanced' },
    { value: 'vegetarian', label: '🥬 Vegetarian' },
    { value: 'vegan', label: '🌱 Vegan' },
    { value: 'keto', label: '🥑 Keto' },
    { value: 'paleo', label: '🥩 Paleo' },
    { value: 'mediterranean', label: '🫒 Mediterranean' },
  ];

  const GOALS = [
    'Weight Loss', 'Muscle Gain', 'Maintain Weight',
    'Improve Energy', 'Heart Health', 'Athletic Performance',
  ];

  return (
    <div className="p-4 md:p-6 overflow-y-auto h-full space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-1">
            🥗 Diet Plan Generator
          </h1>
          <p className="text-xs md:text-sm text-gray-400">
            Generate custom daily meal plans complete with macronutrients, portion sizes, grocery list, and meal prep tips.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card space-y-5 animate-slide-up">
          {/* Diet Type Selection */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Dietary Preference
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DIET_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, dietType: value })}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                    form.dietType === value
                      ? 'bg-accent-500/20 border-accent-500/50 text-accent-300 shadow-sm'
                      : 'bg-dark-800/60 border-dark-600/40 text-gray-400 hover:border-dark-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Primary Goal
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {GOALS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setForm({ ...form, goal: g })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    form.goal === g
                      ? 'bg-primary-500/20 border-primary-500/50 text-primary-300 shadow-sm'
                      : 'bg-dark-800/60 border-dark-600/40 text-gray-400 hover:border-dark-500'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <input
              type="text"
              name="goal"
              value={form.goal}
              onChange={handleChange}
              placeholder="Or enter a custom goal..."
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Allergies */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Allergies & Restrictions
              </label>
              <input
                type="text"
                name="allergies"
                value={form.allergies}
                onChange={handleChange}
                placeholder="e.g. Dairy, Nuts, Gluten"
                className="input-field"
              />
            </div>

            {/* Meals Per Day */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Meals Per Day
              </label>
              <select
                name="mealsPerDay"
                value={form.mealsPerDay}
                onChange={handleChange}
                className="select-field"
              >
                {[2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n} meals daily</option>
                ))}
              </select>
            </div>

            {/* Target Calories */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Target Calories (optional)
              </label>
              <input
                type="number"
                name="calories"
                value={form.calories}
                onChange={handleChange}
                placeholder="e.g. 2200 kcal"
                min="1000"
                max="6000"
                className="input-field"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !form.goal.trim()}
            className="btn-accent w-full py-3"
          >
            {loading ? 'Preparing Your Daily Meal Plan...' : '🍽️ Generate Meal Plan'}
          </button>
        </form>

        {/* Loading state */}
        {loading && (
          <div className="glass-card flex justify-center py-8">
            <Loader text="Crafting your personalized meal plan..." />
          </div>
        )}

        {error && (
          <div className="glass-card border-red-500/30 text-red-400 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Plan output */}
        {plan && (
          <div className="glass-card animate-slide-up space-y-4">
            <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2 border-b border-dark-700/50 pb-3">
              <span>🥗</span> Your Daily Meal Plan
            </h3>
            <div className="markdown-content">
              <ReactMarkdown>{plan}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
