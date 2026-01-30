import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { useRecipes, createRecipe, updateRecipe, deleteRecipe } from '../hooks/useData';
import { BREW_TYPES, COMMON_UNITS } from '../lib/utils';
import type { BrewType, Recipe } from '../types';

interface RecipeIngredient {
  id: string;
  name: string;
  amount_value: string;
  amount_unit: string;
}

function RecipeCard({ recipe, onEdit, onBrew, onDelete }: { 
  recipe: Recipe; 
  onEdit: () => void; 
  onBrew: () => void;
  onDelete: () => void;
}) {
  const brewType = BREW_TYPES[recipe.brew_type];
  
  return (
    <div className="brew-card p-4">
      <div className="flex items-start gap-3">
        <span className="text-3xl">{brewType?.emoji || '🍺'}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-amber-900">{recipe.name}</h3>
          <p className="text-sm text-amber-600">{brewType?.label}</p>
          {recipe.description && (
            <p className="text-sm text-amber-500 mt-1 line-clamp-2">{recipe.description}</p>
          )}
        </div>
      </div>

      {/* Target Gravities */}
      {(recipe.target_og || recipe.target_fg) && (
        <div className="flex gap-4 mt-3 text-sm">
          {recipe.target_og && (
            <div className="bg-amber-50 px-3 py-1 rounded-lg">
              <span className="text-amber-600">Target OG:</span>{' '}
              <span className="font-medium text-amber-900">{recipe.target_og}</span>
            </div>
          )}
          {recipe.target_fg && (
            <div className="bg-amber-50 px-3 py-1 rounded-lg">
              <span className="text-amber-600">Target FG:</span>{' '}
              <span className="font-medium text-amber-900">{recipe.target_fg}</span>
            </div>
          )}
        </div>
      )}

      {/* Ingredients Preview */}
      {recipe.default_ingredients && recipe.default_ingredients.length > 0 && (
        <div className="mt-3 text-sm text-amber-600">
          {recipe.default_ingredients.slice(0, 3).map((ing, i) => (
            <span key={i}>
              {i > 0 && ', '}
              {ing.name}
            </span>
          ))}
          {recipe.default_ingredients.length > 3 && (
            <span>, +{recipe.default_ingredients.length - 3} more</span>
          )}
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button onClick={onBrew} className="btn-primary flex-1 py-2 text-sm">
          🍺 Brew This
        </button>
        <button onClick={onEdit} className="btn-secondary py-2 px-3 text-sm">
          ✏️
        </button>
        <button onClick={onDelete} className="text-red-500 hover:text-red-700 py-2 px-3">
          🗑️
        </button>
      </div>
    </div>
  );
}

function RecipeForm({ 
  recipe, 
  onSave, 
  onCancel 
}: { 
  recipe?: Recipe; 
  onSave: (data: Partial<Recipe>) => void; 
  onCancel: () => void;
}) {
  const [name, setName] = useState(recipe?.name || '');
  const [brewType, setBrewType] = useState<BrewType>(recipe?.brew_type || 'cider');
  const [description, setDescription] = useState(recipe?.description || '');
  const [targetOG, setTargetOG] = useState(recipe?.target_og?.toString() || '');
  const [targetFG, setTargetFG] = useState(recipe?.target_fg?.toString() || '');
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(
    recipe?.default_ingredients?.map(ing => ({
      id: uuid(),
      name: ing.name,
      amount_value: ing.amount_value.toString(),
      amount_unit: ing.amount_unit,
    })) || [{ id: uuid(), name: '', amount_value: '', amount_unit: 'lb' }]
  );

  const addIngredient = () => {
    setIngredients([...ingredients, { id: uuid(), name: '', amount_value: '', amount_unit: 'oz' }]);
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(i => i.id !== id));
    }
  };

  const updateIngredient = (id: string, field: keyof RecipeIngredient, value: string) => {
    setIngredients(ingredients.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      brew_type: brewType,
      description: description || null,
      target_og: targetOG ? parseFloat(targetOG) : null,
      target_fg: targetFG ? parseFloat(targetFG) : null,
      default_ingredients: ingredients
        .filter(i => i.name && i.amount_value)
        .map(i => ({
          name: i.name,
          amount_value: parseFloat(i.amount_value),
          amount_unit: i.amount_unit,
        })),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="brew-card p-6 space-y-4">
      <h2 className="font-bold text-amber-900 text-lg">
        {recipe ? 'Edit Recipe' : 'New Recipe'}
      </h2>

      <div>
        <label className="block text-sm text-amber-600 mb-1">Recipe Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Classic Apple Cider"
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-amber-600 mb-1">Type</label>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(BREW_TYPES).map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => setBrewType(key as BrewType)}
              className={`p-2 rounded-xl text-center transition-all ${
                brewType === key 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              <div className="text-xl">{value.emoji}</div>
              <div className="text-xs">{value.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-amber-600 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Notes about this recipe..."
          className="input-field min-h-[80px]"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm text-amber-600 mb-1">Target OG</label>
          <input
            type="number"
            step="0.001"
            value={targetOG}
            onChange={(e) => setTargetOG(e.target.value)}
            placeholder="e.g., 1.055"
            className="input-field"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-amber-600 mb-1">Target FG</label>
          <input
            type="number"
            step="0.001"
            value={targetFG}
            onChange={(e) => setTargetFG(e.target.value)}
            placeholder="e.g., 1.005"
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-amber-600 mb-2">Default Ingredients</label>
        {ingredients.map((ing) => (
          <div key={ing.id} className="flex gap-2 mb-2">
            <input
              type="text"
              value={ing.name}
              onChange={(e) => updateIngredient(ing.id, 'name', e.target.value)}
              placeholder="Name"
              className="input-field flex-1"
            />
            <input
              type="number"
              step="0.01"
              value={ing.amount_value}
              onChange={(e) => updateIngredient(ing.id, 'amount_value', e.target.value)}
              placeholder="Amt"
              className="input-field w-20"
            />
            <select
              value={ing.amount_unit}
              onChange={(e) => updateIngredient(ing.id, 'amount_unit', e.target.value)}
              className="input-field w-20"
            >
              {COMMON_UNITS.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            {ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => removeIngredient(ing.id)}
                className="text-red-500 hover:text-red-700 px-2"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addIngredient}
          className="text-amber-600 hover:text-amber-700 text-sm"
        >
          + Add Ingredient
        </button>
      </div>

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
        <button type="submit" disabled={!name} className="btn-primary flex-1 disabled:opacity-50">
          {recipe ? 'Save Changes' : 'Create Recipe'}
        </button>
      </div>
    </form>
  );
}

export function Recipes() {
  const navigate = useNavigate();
  const { recipes, loading, error, refetch } = useRecipes();
  const [isCreating, setIsCreating] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [deletingRecipe, setDeletingRecipe] = useState<Recipe | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-4xl animate-bounce">📖</div>
      </div>
    );
  }

  const handleCreate = async (data: Partial<Recipe>) => {
    await createRecipe(data);
    setIsCreating(false);
    refetch();
  };

  const handleUpdate = async (data: Partial<Recipe>) => {
    if (editingRecipe) {
      await updateRecipe(editingRecipe.id, data);
      setEditingRecipe(null);
      refetch();
    }
  };

  const handleDelete = async () => {
    if (deletingRecipe) {
      await deleteRecipe(deletingRecipe.id);
      setDeletingRecipe(null);
      refetch();
    }
  };

  const handleBrew = (recipe: Recipe) => {
    navigate(`/batches/new?recipe=${recipe.id}`);
  };

  if (isCreating) {
    return (
      <div className="space-y-4">
        <RecipeForm onSave={handleCreate} onCancel={() => setIsCreating(false)} />
      </div>
    );
  }

  if (editingRecipe) {
    return (
      <div className="space-y-4">
        <RecipeForm 
          recipe={editingRecipe} 
          onSave={handleUpdate} 
          onCancel={() => setEditingRecipe(null)} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-amber-900">📖 Recipes</h1>
        <button onClick={() => setIsCreating(true)} className="btn-primary text-sm py-2 px-4">
          + New Recipe
        </button>
      </div>

      {error && (
        <div className="brew-card p-4 bg-red-50 border-red-200">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {recipes.length === 0 ? (
        <div className="brew-card p-8 text-center">
          <div className="text-4xl mb-3">📖</div>
          <p className="text-amber-700">No recipes yet!</p>
          <p className="text-amber-500 text-sm mt-1">Save your favorite recipes to brew again.</p>
          <button onClick={() => setIsCreating(true)} className="btn-primary mt-4">
            Create Your First Recipe
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {recipes.map(recipe => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe}
              onEdit={() => setEditingRecipe(recipe)}
              onBrew={() => handleBrew(recipe)}
              onDelete={() => setDeletingRecipe(recipe)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingRecipe && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Delete Recipe?</h2>
            <p className="text-amber-600 mb-4">
              Delete "{deletingRecipe.name}"? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button onClick={handleDelete} className="btn-danger flex-1">Delete</button>
              <button onClick={() => setDeletingRecipe(null)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
