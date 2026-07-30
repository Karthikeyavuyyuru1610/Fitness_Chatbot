import { useState } from 'react';
import BMICalculator from '../components/BMICalculator';
import { calculateBMI } from '../services/api';

export default function BMIPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (formData) => {
    setLoading(true);
    setResult(null);

    try {
      const { data } = await calculateBMI(formData);
      if (data.success) setResult(data.data);
    } catch (err) {
      console.error('BMI calculation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 overflow-y-auto h-full space-y-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-1">
            📊 BMI & Calorie Calculator
          </h1>
          <p className="text-xs md:text-sm text-gray-400">
            Calculate your Body Mass Index (BMI), Basal Metabolic Rate (BMR), daily Total Energy Expenditure (TDEE), and macro split.
          </p>
        </div>

        <div className="animate-slide-up">
          <BMICalculator
            onCalculate={handleCalculate}
            result={result}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
