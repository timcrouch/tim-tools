import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Simple PIN hashing (SHA-256)
export async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + 'brew-tracker-salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Auth helpers
export async function verifyPin(pin: string): Promise<boolean> {
  const hashedPin = await hashPin(pin);
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'pin_hash')
    .single();
  
  if (error || !data) return false;
  return data.value === hashedPin;
}

export async function setPin(pin: string): Promise<boolean> {
  const hashedPin = await hashPin(pin);
  const { error } = await supabase
    .from('settings')
    .upsert({ key: 'pin_hash', value: hashedPin });
  
  return !error;
}

export async function isPinSet(): Promise<boolean> {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'pin_hash')
    .single();
  
  return !error && !!data;
}
