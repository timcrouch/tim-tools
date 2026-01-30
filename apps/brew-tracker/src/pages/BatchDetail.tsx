import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBatch, updateBatch, deleteBatch, addIngredient, deleteIngredient, addGravityReading, deleteGravityReading, createReminder, useReminders, toggleReminder, deleteReminder } from '../hooks/useData';
import { STATUS_CONFIG, BREW_TYPES, daysSince, formatDate, calculateABV, calculateAttenuation, getNextStatus, COMMON_UNITS } from '../lib/utils';
import { GravityChart } from '../components/GravityChart';
import type { BatchStatus, Ingredient } from '../types';

function IngredientRow({ ingredient, onDelete }: { ingredient: Ingredient; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-amber-100 last:border-0">
      <div>
        <span className="font-medium text-amber-900">{ingredient.name}</span>
        <span className="text-amber-600 ml-2">
          {ingredient.amount_value} {ingredient.amount_unit}
        </span>
        {ingredient.cost && (
          <span className="text-amber-500 ml-2">(${ingredient.cost.toFixed(2)})</span>
        )}
      </div>
      <button onClick={onDelete} className="text-red-500 hover:text-red-700 p-1">
        ✕
      </button>
    </div>
  );
}

function AddIngredientForm({ batchId, onAdd }: { batchId: string; onAdd: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('oz');
  const [cost, setCost] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addIngredient({
      batch_id: batchId,
      name,
      amount_value: parseFloat(amount),
      amount_unit: unit,
      cost: cost ? parseFloat(cost) : null,
    });
    setName('');
    setAmount('');
    setCost('');
    setIsOpen(false);
    onAdd();
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="btn-secondary w-full text-sm py-2">
        + Add Ingredient
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-amber-50 rounded-xl p-4 space-y-3">
      <input
        type="text"
        placeholder="Ingredient name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input-field"
        required
      />
      <div className="flex gap-2">
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-field flex-1"
          required
        />
        <select value={unit} onChange={(e) => setUnit(e.target.value)} className="input-field w-24">
          {COMMON_UNITS.map(u => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>
      <input
        type="number"
        step="0.01"
        placeholder="Cost (optional)"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        className="input-field"
      />
      <div className="flex gap-2">
        <button type="submit" className="btn-primary flex-1 py-2 text-sm">Save</button>
        <button type="button" onClick={() => setIsOpen(false)} className="btn-secondary flex-1 py-2 text-sm">Cancel</button>
      </div>
    </form>
  );
}

function AddGravityForm({ batchId, onAdd }: { batchId: string; onAdd: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [gravity, setGravity] = useState('');
  const [temp, setTemp] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addGravityReading({
      batch_id: batchId,
      reading_date: date,
      gravity: parseFloat(gravity),
      temperature: temp ? parseFloat(temp) : null,
      notes: notes || null,
    });
    setGravity('');
    setTemp('');
    setNotes('');
    setIsOpen(false);
    onAdd();
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="btn-secondary w-full text-sm py-2">
        + Add Reading
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-amber-50 rounded-xl p-4 space-y-3">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="input-field"
        required
      />
      <div className="flex gap-2">
        <input
          type="number"
          step="0.001"
          placeholder="Gravity (e.g., 1.045)"
          value={gravity}
          onChange={(e) => setGravity(e.target.value)}
          className="input-field flex-1"
          required
        />
        <input
          type="number"
          step="0.1"
          placeholder="Temp °F"
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          className="input-field w-24"
        />
      </div>
      <input
        type="text"
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="input-field"
      />
      <div className="flex gap-2">
        <button type="submit" className="btn-primary flex-1 py-2 text-sm">Save</button>
        <button type="button" onClick={() => setIsOpen(false)} className="btn-secondary flex-1 py-2 text-sm">Cancel</button>
      </div>
    </form>
  );
}

function AddReminderForm({ batchId, onAdd }: { batchId: string; onAdd: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createReminder({
      batch_id: batchId,
      title,
      due_date: dueDate,
    });
    setTitle('');
    setDueDate('');
    setIsOpen(false);
    onAdd();
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="btn-secondary w-full text-sm py-2">
        + Add Reminder
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-amber-50 rounded-xl p-4 space-y-3">
      <input
        type="text"
        placeholder="Reminder title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input-field"
        required
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="input-field"
        required
      />
      <div className="flex gap-2">
        <button type="submit" className="btn-primary flex-1 py-2 text-sm">Save</button>
        <button type="button" onClick={() => setIsOpen(false)} className="btn-secondary flex-1 py-2 text-sm">Cancel</button>
      </div>
    </form>
  );
}

export function BatchDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { batch, ingredients, gravityReadings, loading, error, refetch } = useBatch(id);
  const { reminders, refetch: refetchReminders } = useReminders(id);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Record<string, any>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-4xl animate-bounce">🍺</div>
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="brew-card p-6 text-center">
        <div className="text-4xl mb-3">😞</div>
        <p className="text-red-600">{error || 'Batch not found'}</p>
        <Link to="/batches" className="btn-primary inline-block mt-4">
          Back to Batches
        </Link>
      </div>
    );
  }

  const status = STATUS_CONFIG[batch.status as BatchStatus];
  const brewType = BREW_TYPES[batch.brew_type];
  const days = daysSince(batch.start_date);
  const nextStatus = getNextStatus(batch.status as BatchStatus);
  const calculatedABV = calculateABV(batch.original_gravity, batch.final_gravity);
  const attenuation = calculateAttenuation(batch.original_gravity, batch.final_gravity);
  const totalCost = ingredients.reduce((acc, ing) => acc + (ing.cost || 0), 0);

  const handleStatusAdvance = async () => {
    if (!nextStatus) return;
    
    const updates: Partial<typeof batch> = { status: nextStatus };
    if (nextStatus === 'bottled') {
      updates.bottle_date = new Date().toISOString().split('T')[0];
    } else if (nextStatus === 'ready') {
      updates.ready_date = new Date().toISOString().split('T')[0];
    }
    
    await updateBatch(batch.id, updates);
    refetch();
  };

  const handleSaveEdit = async () => {
    await updateBatch(batch.id, editData);
    setIsEditing(false);
    refetch();
  };

  const handleDelete = async () => {
    await deleteBatch(batch.id);
    navigate('/batches');
  };

  const handleDeleteIngredient = async (ingredientId: string) => {
    await deleteIngredient(ingredientId);
    refetch();
  };

  const handleDeleteReading = async (readingId: string) => {
    await deleteGravityReading(readingId);
    refetch();
  };

  const handleToggleReminder = async (reminderId: string, completed: boolean) => {
    await toggleReminder(reminderId, !completed);
    refetchReminders();
  };

  const handleDeleteReminder = async (reminderId: string) => {
    await deleteReminder(reminderId);
    refetchReminders();
  };

  // Update ABV if we have final gravity
  const updateABVIfNeeded = async () => {
    if (calculatedABV && calculatedABV !== batch.abv) {
      await updateBatch(batch.id, { abv: calculatedABV });
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <button onClick={() => navigate(-1)} className="text-amber-600 hover:text-amber-700">
          ← Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/batches/new?clone=${batch.id}`)}
            className="text-amber-600 hover:text-amber-700 text-sm"
          >
            🔄 Brew Again
          </button>
          <button
            onClick={() => {
              setEditData(batch);
              setIsEditing(true);
            }}
            className="text-amber-600 hover:text-amber-700 text-sm"
          >
            ✏️ Edit
          </button>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="brew-card p-6">
        <div className="flex items-start gap-4">
          <span className="text-5xl">{brewType?.emoji || '🍺'}</span>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-amber-900">{batch.name}</h1>
            <p className="text-amber-600">{brewType?.label} • {batch.batch_size_value} {batch.batch_size_unit}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${status.color}`}>
                {status.emoji} {status.label}
              </span>
              <span className="text-amber-600 text-sm">Day {days}</span>
            </div>
          </div>
        </div>

        {/* Status Advancement */}
        {nextStatus && (
          <button
            onClick={handleStatusAdvance}
            className="btn-primary w-full mt-4"
          >
            {STATUS_CONFIG[nextStatus].emoji} Move to {STATUS_CONFIG[nextStatus].label}
          </button>
        )}

        {/* Bubbles animation for fermenting */}
        {batch.status === 'fermenting' && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="animate-bubble text-2xl">🫧</span>
            <span className="animate-bubble-delay text-2xl">🫧</span>
            <span className="animate-bubble-delay-2 text-2xl">🫧</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-md border border-amber-100 text-center">
          <div className="text-sm text-amber-600">OG</div>
          <div className="text-xl font-bold text-amber-900">{batch.original_gravity || '—'}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border border-amber-100 text-center">
          <div className="text-sm text-amber-600">FG</div>
          <div className="text-xl font-bold text-amber-900">{batch.final_gravity || '—'}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border border-amber-100 text-center">
          <div className="text-sm text-amber-600">ABV</div>
          <div className="text-xl font-bold text-amber-900">{calculatedABV ? `${calculatedABV}%` : '—'}</div>
          {calculatedABV && calculatedABV !== batch.abv && (
            <button onClick={updateABVIfNeeded} className="text-xs text-amber-500">Save</button>
          )}
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border border-amber-100 text-center">
          <div className="text-sm text-amber-600">Attenuation</div>
          <div className="text-xl font-bold text-amber-900">{attenuation ? `${attenuation}%` : '—'}</div>
        </div>
      </div>

      {/* Dates */}
      <div className="brew-card p-4">
        <h2 className="font-bold text-amber-900 mb-3">📅 Timeline</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-amber-600">Started</span>
            <span className="text-amber-900 font-medium">{formatDate(batch.start_date)}</span>
          </div>
          {batch.bottle_date && (
            <div className="flex justify-between">
              <span className="text-amber-600">Bottled</span>
              <span className="text-amber-900 font-medium">{formatDate(batch.bottle_date)}</span>
            </div>
          )}
          {batch.ready_date && (
            <div className="flex justify-between">
              <span className="text-amber-600">Ready</span>
              <span className="text-amber-900 font-medium">{formatDate(batch.ready_date)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Ingredients */}
      <div className="brew-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-amber-900">🌾 Ingredients</h2>
          {totalCost > 0 && (
            <span className="text-amber-600 text-sm">Total: ${totalCost.toFixed(2)}</span>
          )}
        </div>
        {ingredients.length === 0 ? (
          <p className="text-amber-500 text-sm mb-3">No ingredients added yet</p>
        ) : (
          <div className="mb-3">
            {ingredients.map(ing => (
              <IngredientRow 
                key={ing.id} 
                ingredient={ing} 
                onDelete={() => handleDeleteIngredient(ing.id)} 
              />
            ))}
          </div>
        )}
        <AddIngredientForm batchId={batch.id} onAdd={refetch} />
      </div>

      {/* Gravity Readings */}
      <div className="brew-card p-4">
        <h2 className="font-bold text-amber-900 mb-3">📊 Gravity Readings</h2>
        
        {gravityReadings.length > 1 && (
          <div className="mb-4">
            <GravityChart readings={gravityReadings} />
          </div>
        )}
        
        {gravityReadings.length === 0 ? (
          <p className="text-amber-500 text-sm mb-3">No readings yet</p>
        ) : (
          <div className="space-y-2 mb-3">
            {gravityReadings.map(reading => (
              <div key={reading.id} className="flex items-center justify-between py-2 border-b border-amber-100 last:border-0">
                <div>
                  <span className="font-medium text-amber-900">{reading.gravity.toFixed(3)}</span>
                  <span className="text-amber-600 ml-2">{formatDate(reading.reading_date)}</span>
                  {reading.temperature && (
                    <span className="text-amber-500 ml-2">({reading.temperature}°F)</span>
                  )}
                </div>
                <button onClick={() => handleDeleteReading(reading.id)} className="text-red-500 hover:text-red-700 p-1">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <AddGravityForm batchId={batch.id} onAdd={refetch} />
      </div>

      {/* Reminders */}
      <div className="brew-card p-4">
        <h2 className="font-bold text-amber-900 mb-3">🔔 Reminders</h2>
        {reminders.length === 0 ? (
          <p className="text-amber-500 text-sm mb-3">No reminders set</p>
        ) : (
          <div className="space-y-2 mb-3">
            {reminders.map(reminder => (
              <div key={reminder.id} className="flex items-center justify-between py-2 border-b border-amber-100 last:border-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleReminder(reminder.id, reminder.completed)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      reminder.completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-amber-300 hover:border-amber-500'
                    }`}
                  >
                    {reminder.completed && '✓'}
                  </button>
                  <div>
                    <span className={`font-medium ${reminder.completed ? 'line-through text-amber-400' : 'text-amber-900'}`}>
                      {reminder.title}
                    </span>
                    <span className="text-amber-600 ml-2 text-sm">{formatDate(reminder.due_date)}</span>
                  </div>
                </div>
                <button onClick={() => handleDeleteReminder(reminder.id)} className="text-red-500 hover:text-red-700 p-1">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <AddReminderForm batchId={batch.id} onAdd={refetchReminders} />
      </div>

      {/* Tasting Notes & Rating */}
      {(batch.status === 'ready' || batch.status === 'finished') && (
        <div className="brew-card p-4">
          <h2 className="font-bold text-amber-900 mb-3">🍷 Tasting Notes</h2>
          
          <div className="mb-4">
            <label className="block text-sm text-amber-600 mb-1">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={async () => {
                    await updateBatch(batch.id, { rating: star });
                    refetch();
                  }}
                  className={`text-3xl transition-transform hover:scale-110 ${
                    star <= (batch.rating || 0) ? '' : 'grayscale opacity-30'
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-amber-600 mb-1">Notes</label>
            <textarea
              value={batch.tasting_notes || ''}
              onChange={async (e) => {
                await updateBatch(batch.id, { tasting_notes: e.target.value });
              }}
              onBlur={refetch}
              placeholder="How does it taste? Aroma? Appearance?"
              className="input-field min-h-[100px]"
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-amber-900 mb-4">Edit Batch</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-amber-600 mb-1">Name</label>
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm text-amber-600 mb-1">Original Gravity</label>
                <input
                  type="number"
                  step="0.001"
                  value={editData.original_gravity || ''}
                  onChange={(e) => setEditData({ ...editData, original_gravity: parseFloat(e.target.value) || null })}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm text-amber-600 mb-1">Final Gravity</label>
                <input
                  type="number"
                  step="0.001"
                  value={editData.final_gravity || ''}
                  onChange={(e) => setEditData({ ...editData, final_gravity: parseFloat(e.target.value) || null })}
                  className="input-field"
                />
              </div>
              
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm text-amber-600 mb-1">Batch Size</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editData.batch_size_value || ''}
                    onChange={(e) => setEditData({ ...editData, batch_size_value: parseFloat(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div className="w-28">
                  <label className="block text-sm text-amber-600 mb-1">Unit</label>
                  <select
                    value={editData.batch_size_unit || 'gallons'}
                    onChange={(e) => setEditData({ ...editData, batch_size_unit: e.target.value as any })}
                    className="input-field"
                  >
                    <option value="gallons">Gallons</option>
                    <option value="liters">Liters</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button onClick={handleSaveEdit} className="btn-primary flex-1">Save</button>
              <button onClick={() => setIsEditing(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Button */}
      <div className="brew-card p-4">
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="btn-danger w-full"
        >
          🗑️ Delete Batch
        </button>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Delete Batch?</h2>
            <p className="text-amber-600 mb-4">
              This will permanently delete "{batch.name}" and all its data.
            </p>
            <div className="flex gap-2">
              <button onClick={handleDelete} className="btn-danger flex-1">Delete</button>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
