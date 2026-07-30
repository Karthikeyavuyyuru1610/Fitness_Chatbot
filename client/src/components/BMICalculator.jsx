import { useState } from 'react';

/**
 * Interactive BMI calculator form with visual gauge display.
 * Performs calculation via the backend API and renders results.
 */
export default function BMICalculator({ onCalculate, result, loading }) {
  const [form, setForm] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    activityLevel: 'moderate',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate(form);
  };

  /** Returns a Tailwind color class based on BMI category. */
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Underweight':    return 'text-blue-400';
      case 'Normal weight':  return 'text-accent-400';
      case 'Overweight':     return 'text-yellow-400';
      case 'Obese':          return 'text-red-400';
      default:               return 'text-gray-400';
    }
  };

  /** Returns the fill percentage for the BMI gauge arc. */
  const getGaugePercent = (bmi) => {
    if (bmi < 10) return 5;
    if (bmi > 40) return 100;
    return ((bmi - 10) / 30) * 100;
  };

  return (
    <div className="space-y-6">
      {/* ── Form ───────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="glass-card space-y-5">
        <h3 className="text-lg font-semibold text-gray-100">Enter Your Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Weight */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              placeholder="e.g. 70"
              required
              min="1"
              className="input-field"
            />
          </div>

          {/* Height */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Height (cm)
            </label>
            <input
              type="number"
              name="height"
              value={form.height}
              onChange={handleChange}
              placeholder="e.g. 175"
              required
              min="1"
              className="input-field"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="e.g. 25"
              required
              min="1"
              max="120"
              className="input-field"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="select-field"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Activity Level (full width) */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Activity Level
            </label>
            <select
              name="activityLevel"
              value={form.activityLevel}
              onChange={handleChange}
              className="select-field"
            >
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="light">Light (1-3 days/week)</option>
              <option value="moderate">Moderate (3-5 days/week)</option>
              <option value="active">Active (6-7 days/week)</option>
              <option value="very active">Very Active (twice/day)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !form.weight || !form.height || !form.age}
          className="btn-accent w-full"
        >
          {loading ? 'Calculating...' : 'Calculate BMI & Calories'}
        </button>
      </form>

      {/* ── Results ────────────────────────────────────────────────── */}
      {result && (
        <div className="animate-slide-up space-y-4">
          {/* BMI Gauge */}
          <div className="glass-card flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Your BMI</h3>

            {/* Circular gauge */}
            <div className="relative w-48 h-24 mb-3">
              <svg viewBox="0 0 200 100" className="w-full h-full">
                {/* Background arc */}
                <path
                  d="M 20 90 A 80 80 0 0 1 180 90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-dark-700"
                  strokeLinecap="round"
                />
                {/* Filled arc */}
                <path
                  d="M 20 90 A 80 80 0 0 1 180 90"
                  fill="none"
                  stroke="url(#bmiGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${getGaugePercent(result.bmi) * 2.51} 251`}
                />
                <defs>
                  <linearGradient id="bmiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="40%" stopColor="#22c55e" />
                    <stop offset="70%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
                <span className="text-3xl font-bold text-gray-100">{result.bmi}</span>
              </div>
            </div>

            <span className={`text-sm font-semibold ${getCategoryColor(result.category)}`}>
              {result.category}
            </span>
          </div>

          {/* Calorie & Macro Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Daily Calories</p>
              <p className="text-2xl font-bold text-primary-400">{result.dailyCalories}</p>
              <p className="text-xs text-gray-500">kcal / day</p>
            </div>
            <div className="glass-card text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">BMR</p>
              <p className="text-2xl font-bold text-accent-400">{result.bmr}</p>
              <p className="text-xs text-gray-500">kcal / day</p>
            </div>
            <div className="glass-card text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">BMI Score</p>
              <p className="text-2xl font-bold text-yellow-400">{result.bmi}</p>
              <p className="text-xs text-gray-500">kg/m²</p>
            </div>
          </div>

          {/* Macronutrients */}
          <div className="glass-card">
            <h4 className="text-sm font-semibold text-gray-200 mb-4">
              Recommended Macronutrients
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Protein', data: result.macros.protein, color: 'from-blue-500 to-blue-400' },
                { label: 'Carbs',   data: result.macros.carbs,   color: 'from-accent-500 to-accent-400' },
                { label: 'Fat',     data: result.macros.fat,     color: 'from-yellow-500 to-yellow-400' },
              ].map(({ label, data, color }) => (
                <div key={label} className="text-center">
                  <div
                    className={`w-14 h-14 mx-auto mb-2 rounded-full bg-gradient-to-br ${color}
                                flex items-center justify-center shadow-lg`}
                  >
                    <span className="text-xs font-bold text-white">{data.percentage}%</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-200">{label}</p>
                  <p className="text-xs text-gray-500">{data.grams}g / day</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="glass-card">
            <h4 className="text-sm font-semibold text-gray-200 mb-3">Recommendations</h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-accent-400 mt-0.5">✓</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
