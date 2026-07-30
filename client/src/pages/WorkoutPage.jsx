import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateWorkout } from '../services/api';
import Loader from '../components/Loader';

export default function WorkoutPage() {
  const [form, setForm] = useState({
    fitnessLevel: 'beginner',
    goal: '',
    equipment: '',
    daysPerWeek: 3,
    duration: 45,
  });
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'daysPerWeek' || name === 'duration' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.goal.trim()) return;

    setLoading(true);
    setError('');
    setPlan('');

    try {
      const { data } = await generateWorkout(form);
      if (data.success) setPlan(data.data.plan);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to generate workout plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const GOALS = [
    'Build Muscle', 'Lose Weight', 'Improve Endurance',
    'Increase Flexibility', 'General Fitness', 'Strength Training',
  ];

  return (
    <div className="p-4 md:p-6 overflow-y-auto h-full space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-1">
            🏋️ Workout Plan Generator
          </h1>
          <p className="text-xs md:text-sm text-gray-400">
            Generate a personalized weekly exercise routine tailored to your equipment, frequency, and fitness targets.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card space-y-5 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fitness Level */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Fitness Experience Level
              </label>
              <select
                name="fitnessLevel"
                value={form.fitnessLevel}
                onChange={handleChange}
                className="select-field"
              >
                <option value="beginner">Beginner (0-6 months)</option>
                <option value="intermediate">Intermediate (1-3 years)</option>
                <option value="advanced">Advanced (3+ years)</option>
              </select>
            </div>

            {/* Equipment */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Available Equipment
              </label>
              <input
                type="text"
                name="equipment"
                value={form.equipment}
                onChange={handleChange}
                placeholder="e.g. Dumbbells, Barbell, Bodyweight only"
                className="input-field"
              />
            </div>

            {/* Days Per Week */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Training Days / Week: <span className="text-primary-400 font-bold">{form.daysPerWeek} days</span>
              </label>
              <input
                type="range"
                name="daysPerWeek"
                min="1"
                max="7"
                value={form.daysPerWeek}
                onChange={handleChange}
                className="w-full accent-primary-500 mt-2"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>1d</span><span>3d</span><span>5d</span><span>7d</span>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Session Length: <span className="text-primary-400 font-bold">{form.duration} mins</span>
              </label>
              <input
                type="range"
                name="duration"
                min="15"
                max="120"
                step="5"
                value={form.duration}
                onChange={handleChange}
                className="w-full accent-primary-500 mt-2"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>15m</span><span>45m</span><span>75m</span><span>120m</span>
              </div>
            </div>
          </div>

          {/* Goal Selection Chips */}
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
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

          <button
            type="submit"
            disabled={loading || !form.goal.trim()}
            className="btn-primary w-full py-3"
          >
            {loading ? 'Designing Your Workout Routine...' : '⚡ Generate Workout Routine'}
          </button>
        </form>

        {/* Loading state */}
        {loading && (
          <div className="glass-card flex justify-center py-8">
            <Loader text="Designing your custom workout schedule..." />
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
              <span>📋</span> Your Personalized Workout Routine
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
