import { format, differenceInDays, parseISO, isToday, isTomorrow, isPast } from 'date-fns';
import type { BatchStatus, BrewType } from '../types';

export function calculateABV(og: number | null, fg: number | null): number | null {
  if (!og || !fg) return null;
  return Math.round((og - fg) * 131.25 * 10) / 10;
}

export function calculateAttenuation(og: number | null, fg: number | null): number | null {
  if (!og || !fg || og === 1) return null;
  return Math.round(((og - fg) / (og - 1)) * 100);
}

export function daysSince(dateString: string): number {
  return differenceInDays(new Date(), parseISO(dateString));
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return '—';
  return format(parseISO(dateString), 'MMM d, yyyy');
}

export function formatShortDate(dateString: string): string {
  return format(parseISO(dateString), 'MMM d');
}

export function getRelativeDate(dateString: string): string {
  const date = parseISO(dateString);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isPast(date)) return `${differenceInDays(new Date(), date)} days ago`;
  return `in ${differenceInDays(date, new Date())} days`;
}

export function isOverdue(dateString: string): boolean {
  return isPast(parseISO(dateString)) && !isToday(parseISO(dateString));
}

export const STATUS_CONFIG: Record<BatchStatus, { label: string; color: string; emoji: string; next?: BatchStatus }> = {
  fermenting: {
    label: 'Fermenting',
    color: 'status-fermenting',
    emoji: '🫧',
    next: 'conditioning',
  },
  conditioning: {
    label: 'Conditioning',
    color: 'status-conditioning',
    emoji: '❄️',
    next: 'bottled',
  },
  bottled: {
    label: 'Bottled',
    color: 'status-bottled',
    emoji: '🍾',
    next: 'ready',
  },
  ready: {
    label: 'Ready to Drink!',
    color: 'status-ready',
    emoji: '✅',
    next: 'finished',
  },
  finished: {
    label: 'Finished',
    color: 'status-finished',
    emoji: '🏁',
  },
};

export const BREW_TYPES: Record<BrewType, { label: string; emoji: string }> = {
  cider: { label: 'Cider', emoji: '🍎' },
  beer: { label: 'Beer', emoji: '🍺' },
  wine: { label: 'Wine', emoji: '🍷' },
  mead: { label: 'Mead', emoji: '🍯' },
  other: { label: 'Other', emoji: '🧪' },
};

export const SIZE_UNITS = [
  { value: 'gallons', label: 'Gallons' },
  { value: 'liters', label: 'Liters' },
];

export const COMMON_UNITS = [
  'oz', 'lb', 'g', 'kg', 
  'tsp', 'tbsp', 'cup',
  'ml', 'L', 'gal',
  'packet', 'each'
];

export function getStatusBadgeClass(status: BatchStatus): string {
  return STATUS_CONFIG[status]?.color || 'status-fermenting';
}

export function getNextStatus(status: BatchStatus): BatchStatus | undefined {
  return STATUS_CONFIG[status]?.next;
}
