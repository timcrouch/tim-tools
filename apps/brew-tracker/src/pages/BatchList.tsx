import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBatches } from '../hooks/useData';
import { STATUS_CONFIG, BREW_TYPES, daysSince, formatDate } from '../lib/utils';
import type { Batch, BatchStatus, BrewType } from '../types';

type FilterStatus = BatchStatus | 'all' | 'active';

function BatchCard({ batch }: { batch: Batch }) {
  const status = STATUS_CONFIG[batch.status as BatchStatus];
  const brewType = BREW_TYPES[batch.brew_type];
  const days = daysSince(batch.start_date);

  return (
    <Link to={`/batches/${batch.id}`} className="brew-card block">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{brewType?.emoji || '🍺'}</span>
            <div>
              <h3 className="font-semibold text-amber-900">{batch.name}</h3>
              <p className="text-sm text-amber-600">
                {brewType?.label} • {batch.batch_size_value} {batch.batch_size_unit}
              </p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${status.color}`}>
            {status.emoji} {status.label}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="bg-amber-50 rounded-lg p-2">
            <div className="text-amber-600 text-xs">Started</div>
            <div className="font-medium text-amber-900">{formatDate(batch.start_date)}</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-2">
            <div className="text-amber-600 text-xs">Days</div>
            <div className="font-medium text-amber-900">{days}</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-2">
            <div className="text-amber-600 text-xs">ABV</div>
            <div className="font-medium text-amber-900">{batch.abv ? `${batch.abv}%` : '—'}</div>
          </div>
        </div>

        {batch.rating && (
          <div className="mt-2 text-center">
            <span className="text-amber-500">{'⭐'.repeat(batch.rating)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export function BatchList() {
  const { batches, loading, error } = useBatches();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [typeFilter, setTypeFilter] = useState<BrewType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-4xl animate-bounce">🍺</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="brew-card p-6 text-center">
        <div className="text-4xl mb-3">😞</div>
        <p className="text-red-600">Error loading batches: {error}</p>
      </div>
    );
  }

  // Filter batches
  const filteredBatches = batches.filter(batch => {
    // Status filter
    if (filter === 'active') {
      if (!['fermenting', 'conditioning', 'bottled', 'ready'].includes(batch.status)) {
        return false;
      }
    } else if (filter !== 'all' && batch.status !== filter) {
      return false;
    }

    // Type filter
    if (typeFilter !== 'all' && batch.brew_type !== typeFilter) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return batch.name.toLowerCase().includes(query);
    }

    return true;
  });

  const statusOptions: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'fermenting', label: '🫧 Fermenting' },
    { value: 'conditioning', label: '❄️ Conditioning' },
    { value: 'bottled', label: '🍾 Bottled' },
    { value: 'ready', label: '✅ Ready' },
    { value: 'finished', label: '🏁 Finished' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-amber-900">Batches</h1>
        <Link to="/batches/new" className="btn-primary text-sm py-2 px-4">
          + New Batch
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search batches..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="input-field"
      />

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {statusOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`px-3 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              filter === option.value
                ? 'bg-amber-500 text-white'
                : 'bg-white text-amber-700 border border-amber-200 hover:border-amber-400'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Type filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-3 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
            typeFilter === 'all'
              ? 'bg-amber-500 text-white'
              : 'bg-white text-amber-700 border border-amber-200 hover:border-amber-400'
          }`}
        >
          All Types
        </button>
        {Object.entries(BREW_TYPES).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setTypeFilter(key as BrewType)}
            className={`px-3 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              typeFilter === key
                ? 'bg-amber-500 text-white'
                : 'bg-white text-amber-700 border border-amber-200 hover:border-amber-400'
            }`}
          >
            {value.emoji} {value.label}
          </button>
        ))}
      </div>

      {/* Batch List */}
      {filteredBatches.length === 0 ? (
        <div className="brew-card p-8 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-amber-700">No batches found</p>
          {batches.length === 0 && (
            <Link to="/batches/new" className="btn-primary inline-block mt-4">
              Start Your First Batch
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBatches.map(batch => (
            <BatchCard key={batch.id} batch={batch} />
          ))}
        </div>
      )}

      <p className="text-center text-sm text-amber-500 mt-4">
        {filteredBatches.length} of {batches.length} batches
      </p>
    </div>
  );
}
