import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { createBatch, addIngredient, addGravityReading, useBatch, useRecipes } from '../hooks/useData';
import { BREW_TYPES, SIZE_UNITS, COMMON_UNITS } from '../lib/utils';
import type { BrewType, SizeUnit, Recipe } from '../types';

interface NewIngredient {
  id: string;
  name: string;
  amount_value: string;
  amount_unit: string;
  cost: string;
}

export function NewBatch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cloneId = searchParams.get('clone');
  const recipeId = searchParams.get('recipe');
  
  const { batch: cloneBatch, ingredients: cloneIngredients } = useBatch(cloneId || undefined);
  const { recipes } = useRecipes();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Step 1: Basic Info
  const [name, setName] = useState('');
  const [brewType, setBrewType] = useState<BrewType>('cider');
  const [batchSize, setBatchSize] = useState('5');
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>('gallons');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Step 2: Ingredients
  const [ingredients, setIngredients] = useState<NewIngredient[]>([
    { id: uuid(), name: '', amount_value: '', amount_unit: 'lb', cost: '' }
  ]);
  
  // Step 3: Initial Reading
  const [originalGravity, setOriginalGravity] = useState('');
  const [temperature, setTemperature] = useState('');
  
  // Recipe selection
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Handle cloning from existing batch
  useEffect(() => {
    if (cloneBatch) {
      setName(`${cloneBatch.name} (Copy)`);
      setBrewType(cloneBatch.brew_type);
      setBatchSize(cloneBatch.batch_size_value.toString());
      setSizeUnit(cloneBatch.batch_size_unit);
    }
  }, [cloneBatch]);

  useEffect(() => {
    if (cloneIngredients && cloneIngredients.length > 0) {
      setIngredients(cloneIngredients.map(ing => ({
        id: uuid(),
        name: ing.name,
        amount_value: ing.amount_value.toString(),
        amount_unit: ing.amount_unit,
        cost: ing.cost?.toString() || '',
      })));
    }
  }, [cloneIngredients]);

  // Handle recipe selection
  useEffect(() => {
    if (recipeId && recipes.length > 0) {
      const recipe = recipes.find(r => r.id === recipeId);
      if (recipe) {
        applyRecipe(recipe);
      }
    }
  }, [recipeId, recipes]);

  const applyRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setName(`${recipe.name} Batch`);
    setBrewType(recipe.brew_type);
    if (recipe.default_ingredients && recipe.default_ingredients.length > 0) {
      setIngredients(recipe.default_ingredients.map(ing => ({
        id: uuid(),
        name: ing.name,
        amount_value: ing.amount_value.toString(),
        amount_unit: ing.amount_unit,
        cost: '',
      })));
    }
    if (recipe.target_og) {
      setOriginalGravity(recipe.target_og.toString());
    }
  };

  const addIngredientRow = () => {
    setIngredients([...ingredients, { id: uuid(), name: '', amount_value: '', amount_unit: 'oz', cost: '' }]);
  };

  const removeIngredientRow = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(i => i.id !== id));
    }
  };

  const updateIngredient = (id: string, field: keyof NewIngredient, value: string) => {
    setIngredients(ingredients.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Create batch
    const batch = await createBatch({
      name,
      brew_type: brewType,
      status: 'fermenting',
      batch_size_value: parseFloat(batchSize),
      batch_size_unit: sizeUnit,
      original_gravity: originalGravity ? parseFloat(originalGravity) : null,
      start_date: startDate,
    });

    if (!batch) {
      alert('Failed to create batch');
      setIsSubmitting(false);
      return;
    }

    // Add ingredients
    for (const ing of ingredients) {
      if (ing.name && ing.amount_value) {
        await addIngredient({
          batch_id: batch.id,
          name: ing.name,
          amount_value: parseFloat(ing.amount_value),
          amount_unit: ing.amount_unit,
          cost: ing.cost ? parseFloat(ing.cost) : null,
        });
      }
    }

    // Add initial gravity reading
    if (originalGravity) {
      await addGravityReading({
        batch_id: batch.id,
        reading_date: startDate,
        gravity: parseFloat(originalGravity),
        temperature: temperature ? parseFloat(temperature) : null,
        notes: 'Initial reading (OG)',
      });
    }

    navigate(`/batches/${batch.id}`);
  };

  const canProceedStep1 = name && batchSize && startDate;
  const canSubmit = canProceedStep1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-amber-600 hover:text-amber-700">
          ← Cancel
        </button>
        <h1 className="text-xl font-bold text-amber-900">New Batch</h1>
        <div className="w-16" />
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map(s => (
          <button
            key={s}
            onClick={() => s < step && setStep(s)}
            className={`w-10 h-10 rounded-full font-bold transition-colors ${
              s === step 
                ? 'bg-amber-500 text-white' 
                : s < step 
                  ? 'bg-amber-200 text-amber-700 cursor-pointer hover:bg-amber-300' 
                  : 'bg-amber-100 text-amber-400'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Recipe Selection (at start) */}
      {step === 1 && !cloneId && recipes.length > 0 && (
        <div className="brew-card p-4">
          <h2 className="font-bold text-amber-900 mb-3">📖 Start from Recipe (optional)</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedRecipe(null)}
              className={`px-3 py-2 rounded-lg text-sm ${
                !selectedRecipe ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700'
              }`}
            >
              From Scratch
            </button>
            {recipes.map(recipe => (
              <button
                key={recipe.id}
                onClick={() => applyRecipe(recipe)}
                className={`px-3 py-2 rounded-lg text-sm ${
                  selectedRecipe?.id === recipe.id ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700'
                }`}
              >
                {BREW_TYPES[recipe.brew_type]?.emoji} {recipe.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="brew-card p-6 space-y-4">
          <h2 className="font-bold text-amber-900 text-lg">Basic Info</h2>
          
          <div>
            <label className="block text-sm text-amber-600 mb-1">Batch Name *</label>
            <input
              type="text"
              placeholder="e.g., Apple Cider Batch #1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm text-amber-600 mb-1">Brew Type</label>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(BREW_TYPES).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setBrewType(key as BrewType)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    brewType === key 
                      ? 'bg-amber-500 text-white shadow-md scale-105' 
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  <div className="text-2xl">{value.emoji}</div>
                  <div className="text-xs mt-1">{value.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm text-amber-600 mb-1">Batch Size *</label>
              <input
                type="number"
                step="0.1"
                placeholder="5"
                value={batchSize}
                onChange={(e) => setBatchSize(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="w-32">
              <label className="block text-sm text-amber-600 mb-1">Unit</label>
              <select
                value={sizeUnit}
                onChange={(e) => setSizeUnit(e.target.value as SizeUnit)}
                className="input-field"
              >
                {SIZE_UNITS.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-amber-600 mb-1">Start Date *</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
            />
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!canProceedStep1}
            className="btn-primary w-full disabled:opacity-50"
          >
            Next: Ingredients →
          </button>
        </div>
      )}

      {/* Step 2: Ingredients */}
      {step === 2 && (
        <div className="brew-card p-6 space-y-4">
          <h2 className="font-bold text-amber-900 text-lg">🌾 Ingredients</h2>
          <p className="text-sm text-amber-600">Add your ingredients (optional - you can add more later)</p>

          {ingredients.map((ing, idx) => (
            <div key={ing.id} className="bg-amber-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-amber-700">Ingredient {idx + 1}</span>
                {ingredients.length > 1 && (
                  <button 
                    onClick={() => removeIngredientRow(ing.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <input
                type="text"
                placeholder="Ingredient name"
                value={ing.name}
                onChange={(e) => updateIngredient(ing.id, 'name', e.target.value)}
                className="input-field"
              />
              
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={ing.amount_value}
                  onChange={(e) => updateIngredient(ing.id, 'amount_value', e.target.value)}
                  className="input-field flex-1"
                />
                <select
                  value={ing.amount_unit}
                  onChange={(e) => updateIngredient(ing.id, 'amount_unit', e.target.value)}
                  className="input-field w-24"
                >
                  {COMMON_UNITS.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
              
              <input
                type="number"
                step="0.01"
                placeholder="Cost (optional)"
                value={ing.cost}
                onChange={(e) => updateIngredient(ing.id, 'cost', e.target.value)}
                className="input-field"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addIngredientRow}
            className="btn-secondary w-full"
          >
            + Add Another Ingredient
          </button>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1">
              ← Back
            </button>
            <button onClick={() => setStep(3)} className="btn-primary flex-1">
              Next: Gravity →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Initial Reading */}
      {step === 3 && (
        <div className="brew-card p-6 space-y-4">
          <h2 className="font-bold text-amber-900 text-lg">📊 Initial Gravity Reading</h2>
          <p className="text-sm text-amber-600">Record your original gravity (optional - you can add this later)</p>

          <div>
            <label className="block text-sm text-amber-600 mb-1">Original Gravity (OG)</label>
            <input
              type="number"
              step="0.001"
              placeholder="e.g., 1.055"
              value={originalGravity}
              onChange={(e) => setOriginalGravity(e.target.value)}
              className="input-field text-2xl font-mono text-center"
            />
          </div>

          <div>
            <label className="block text-sm text-amber-600 mb-1">Temperature (°F) - Optional</label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g., 68"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Summary */}
          <div className="bg-amber-50 rounded-xl p-4">
            <h3 className="font-bold text-amber-900 mb-2">📋 Summary</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-amber-600">Name:</span> {name}</p>
              <p><span className="text-amber-600">Type:</span> {BREW_TYPES[brewType]?.emoji} {BREW_TYPES[brewType]?.label}</p>
              <p><span className="text-amber-600">Size:</span> {batchSize} {sizeUnit}</p>
              <p><span className="text-amber-600">Start:</span> {startDate}</p>
              <p><span className="text-amber-600">Ingredients:</span> {ingredients.filter(i => i.name).length}</p>
              {originalGravity && <p><span className="text-amber-600">OG:</span> {originalGravity}</p>}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="btn-secondary flex-1">
              ← Back
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={!canSubmit || isSubmitting}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : '🍺 Start Brewing!'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
