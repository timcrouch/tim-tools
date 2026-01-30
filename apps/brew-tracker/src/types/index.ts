export type BrewType = 'cider' | 'beer' | 'wine' | 'mead' | 'other';
export type BatchStatus = 'fermenting' | 'conditioning' | 'bottled' | 'ready' | 'finished';
export type SizeUnit = 'gallons' | 'liters';

export interface Batch {
  id: string;
  name: string;
  brew_type: BrewType;
  status: BatchStatus;
  batch_size_value: number;
  batch_size_unit: SizeUnit;
  original_gravity: number | null;
  final_gravity: number | null;
  abv: number | null;
  start_date: string;
  bottle_date: string | null;
  ready_date: string | null;
  total_cost: number | null;
  tasting_notes: string | null;
  rating: number | null;
  photo_urls: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Ingredient {
  id: string;
  batch_id: string;
  name: string;
  amount_value: number;
  amount_unit: string;
  cost: number | null;
  notes: string | null;
}

export interface GravityReading {
  id: string;
  batch_id: string;
  reading_date: string;
  gravity: number;
  temperature: number | null;
  notes: string | null;
}

export interface Recipe {
  id: string;
  name: string;
  brew_type: BrewType;
  description: string | null;
  default_ingredients: { name: string; amount_value: number; amount_unit: string }[];
  target_og: number | null;
  target_fg: number | null;
  created_at: string;
}

export interface Reminder {
  id: string;
  batch_id: string | null;
  title: string;
  due_date: string;
  completed: boolean;
  created_at: string;
}

export interface Settings {
  key: string;
  value: string;
}

// Helper type for batch with ingredients
export interface BatchWithDetails extends Batch {
  ingredients?: Ingredient[];
  gravity_readings?: GravityReading[];
}
