import { Link } from 'react-router-dom';
import { useBatches, useReminders } from '../hooks/useData';
import { STATUS_CONFIG, BREW_TYPES, daysSince, formatDate, isOverdue, getRelativeDate } from '../lib/utils';
import type { Batch, BatchStatus } from '../types';

function StatCard({ label, value, emoji }: { label: string; value: string | number; emoji: string }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-amber-100">
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="text-2xl font-bold text-amber-900">{value}</div>
      <div className="text-sm text-amber-600">{label}</div>
    </div>
  );
}

function ActiveBatchCard({ batch }: { batch: Batch }) {
  const status = STATUS_CONFIG[batch.status as BatchStatus];
  const days = daysSince(batch.start_date);
  const brewType = BREW_TYPES[batch.brew_type];

  return (
    <Link to={`/batches/${batch.id}`} className="brew-card block">
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{brewType?.emoji || '🍺'}</span>
            <div>
              <h3 className="font-semibold text-amber-900">{batch.name}</h3>
              <p className="text-sm text-amber-600">{brewType?.label || batch.brew_type}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
            {status.emoji} {status.label}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-amber-700 mt-3">
          <span>{batch.batch_size_value} {batch.batch_size_unit}</span>
          <span className="font-medium">Day {days}</span>
        </div>
        {batch.status === 'fermenting' && (
          <div className="mt-3 flex items-center gap-1">
            <span className="animate-bubble">🫧</span>
            <span className="animate-bubble-delay">🫧</span>
            <span className="animate-bubble-delay-2">🫧</span>
            <span className="text-xs text-amber-500 ml-2">Fermenting...</span>
          </div>
        )}
      </div>
    </Link>
  );
}

function ReminderCard({ reminder, batchName }: { reminder: any; batchName?: string }) {
  const overdue = isOverdue(reminder.due_date);
  
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${
      overdue ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'
    }`}>
      <span className="text-xl">{overdue ? '⚠️' : '🔔'}</span>
      <div className="flex-1 min-w-0">
        <p className={`font-medium truncate ${overdue ? 'text-red-800' : 'text-amber-800'}`}>
          {reminder.title}
        </p>
        <p className="text-xs text-amber-600">
          {getRelativeDate(reminder.due_date)}
          {batchName && ` • ${batchName}`}
        </p>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { batches, loading: batchesLoading } = useBatches();
  const { reminders, loading: remindersLoading } = useReminders();

  if (batchesLoading || remindersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-4xl animate-bounce">🍺</div>
      </div>
    );
  }

  // Calculate stats
  const activeBatches = batches.filter(b => 
    ['fermenting', 'conditioning', 'bottled', 'ready'].includes(b.status)
  );
  const finishedBatches = batches.filter(b => b.status === 'finished');
  const currentYear = new Date().getFullYear();
  const batchesThisYear = batches.filter(b => 
    new Date(b.start_date).getFullYear() === currentYear
  ).length;
  const avgABV = finishedBatches.length > 0
    ? Math.round(finishedBatches.filter(b => b.abv).reduce((acc, b) => acc + (b.abv || 0), 0) / finishedBatches.filter(b => b.abv).length * 10) / 10
    : 0;

  // Upcoming reminders (non-completed, sorted by date)
  const upcomingReminders = reminders
    .filter(r => !r.completed)
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 3);

  // Recent finished batches
  const recentFinished = finishedBatches.slice(0, 5);

  // Create a batch name lookup for reminders
  const batchNameMap = Object.fromEntries(batches.map(b => [b.id, b.name]));

  return (
    <div className="space-y-6">
      {/* Hero / CTA */}
      <Link to="/batches/new" className="block">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">Start a New Brew</h2>
              <p className="text-amber-100 text-sm">Track your next masterpiece</p>
            </div>
            <div className="text-5xl">🍺</div>
          </div>
        </div>
      </Link>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Active Brews" value={activeBatches.length} emoji="🫧" />
        <StatCard label="Total Batches" value={batches.length} emoji="📊" />
        <StatCard label="This Year" value={batchesThisYear} emoji="📅" />
        <StatCard label="Avg ABV" value={avgABV ? `${avgABV}%` : '—'} emoji="🎯" />
      </div>

      {/* Reminders */}
      {upcomingReminders.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-amber-900 flex items-center gap-2">
              <span>🔔</span> Reminders
            </h2>
          </div>
          <div className="space-y-2">
            {upcomingReminders.map(reminder => (
              <ReminderCard 
                key={reminder.id} 
                reminder={reminder} 
                batchName={reminder.batch_id ? batchNameMap[reminder.batch_id] : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* Active Batches */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-amber-900 flex items-center gap-2">
            <span>🫧</span> Active Brews
          </h2>
          <Link to="/batches" className="text-amber-600 text-sm hover:text-amber-700">
            View all →
          </Link>
        </div>
        {activeBatches.length === 0 ? (
          <div className="brew-card p-8 text-center">
            <div className="text-4xl mb-3">🍺</div>
            <p className="text-amber-700">No active brews yet!</p>
            <p className="text-amber-500 text-sm mt-1">Start your first batch to get brewing.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeBatches.slice(0, 3).map(batch => (
              <ActiveBatchCard key={batch.id} batch={batch} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Finished */}
      {recentFinished.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-amber-900 flex items-center gap-2">
            <span>🏁</span> Recently Finished
          </h2>
          <div className="brew-card divide-y divide-amber-100">
            {recentFinished.map(batch => {
              const brewType = BREW_TYPES[batch.brew_type];
              return (
                <Link 
                  key={batch.id} 
                  to={`/batches/${batch.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-amber-50 transition-colors"
                >
                  <span className="text-xl">{brewType?.emoji || '🍺'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-amber-900 truncate">{batch.name}</p>
                    <p className="text-xs text-amber-600">
                      {formatDate(batch.start_date)}
                      {batch.abv && ` • ${batch.abv}% ABV`}
                      {batch.rating && ` • ${'⭐'.repeat(batch.rating)}`}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
