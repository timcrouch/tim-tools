import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Batch, Ingredient, GravityReading, Recipe, Reminder } from '../types';

// Batches
export function useBatches() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBatches = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('batches')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      setError(error.message);
    } else {
      setBatches(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  return { batches, loading, error, refetch: fetchBatches };
}

export function useBatch(id: string | undefined) {
  const [batch, setBatch] = useState<Batch | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [gravityReadings, setGravityReadings] = useState<GravityReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBatch = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    
    const [batchResult, ingredientsResult, readingsResult] = await Promise.all([
      supabase.from('batches').select('*').eq('id', id).single(),
      supabase.from('ingredients').select('*').eq('batch_id', id).order('id'),
      supabase.from('gravity_readings').select('*').eq('batch_id', id).order('reading_date', { ascending: true }),
    ]);
    
    if (batchResult.error) {
      setError(batchResult.error.message);
    } else {
      setBatch(batchResult.data);
      setIngredients(ingredientsResult.data || []);
      setGravityReadings(readingsResult.data || []);
    }
    
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchBatch();
  }, [fetchBatch]);

  return { batch, ingredients, gravityReadings, loading, error, refetch: fetchBatch };
}

export async function createBatch(batch: Partial<Batch>): Promise<Batch | null> {
  const { data, error } = await supabase
    .from('batches')
    .insert(batch)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating batch:', error);
    return null;
  }
  return data;
}

export async function updateBatch(id: string, updates: Partial<Batch>): Promise<boolean> {
  const { error } = await supabase
    .from('batches')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);
  
  return !error;
}

export async function deleteBatch(id: string): Promise<boolean> {
  // Delete related data first
  await supabase.from('ingredients').delete().eq('batch_id', id);
  await supabase.from('gravity_readings').delete().eq('batch_id', id);
  await supabase.from('reminders').delete().eq('batch_id', id);
  
  const { error } = await supabase.from('batches').delete().eq('id', id);
  return !error;
}

// Ingredients
export async function addIngredient(ingredient: Partial<Ingredient>): Promise<Ingredient | null> {
  const { data, error } = await supabase
    .from('ingredients')
    .insert(ingredient)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding ingredient:', error);
    return null;
  }
  return data;
}

export async function updateIngredient(id: string, updates: Partial<Ingredient>): Promise<boolean> {
  const { error } = await supabase.from('ingredients').update(updates).eq('id', id);
  return !error;
}

export async function deleteIngredient(id: string): Promise<boolean> {
  const { error } = await supabase.from('ingredients').delete().eq('id', id);
  return !error;
}

// Gravity Readings
export async function addGravityReading(reading: Partial<GravityReading>): Promise<GravityReading | null> {
  const { data, error } = await supabase
    .from('gravity_readings')
    .insert(reading)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding reading:', error);
    return null;
  }
  return data;
}

export async function deleteGravityReading(id: string): Promise<boolean> {
  const { error } = await supabase.from('gravity_readings').delete().eq('id', id);
  return !error;
}

// Recipes
export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('name');
    
    if (error) {
      setError(error.message);
    } else {
      setRecipes(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return { recipes, loading, error, refetch: fetchRecipes };
}

export async function createRecipe(recipe: Partial<Recipe>): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from('recipes')
    .insert(recipe)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating recipe:', error);
    return null;
  }
  return data;
}

export async function updateRecipe(id: string, updates: Partial<Recipe>): Promise<boolean> {
  const { error } = await supabase.from('recipes').update(updates).eq('id', id);
  return !error;
}

export async function deleteRecipe(id: string): Promise<boolean> {
  const { error } = await supabase.from('recipes').delete().eq('id', id);
  return !error;
}

// Reminders
export function useReminders(batchId?: string) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReminders = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('reminders').select('*').order('due_date');
    
    if (batchId) {
      query = query.eq('batch_id', batchId);
    }
    
    const { data } = await query;
    setReminders(data || []);
    setLoading(false);
  }, [batchId]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  return { reminders, loading, refetch: fetchReminders };
}

export async function createReminder(reminder: Partial<Reminder>): Promise<Reminder | null> {
  const { data, error } = await supabase
    .from('reminders')
    .insert(reminder)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating reminder:', error);
    return null;
  }
  return data;
}

export async function toggleReminder(id: string, completed: boolean): Promise<boolean> {
  const { error } = await supabase
    .from('reminders')
    .update({ completed })
    .eq('id', id);
  return !error;
}

export async function deleteReminder(id: string): Promise<boolean> {
  const { error } = await supabase.from('reminders').delete().eq('id', id);
  return !error;
}

// Export data
export async function exportData(): Promise<object> {
  const [batches, ingredients, readings, recipes, reminders] = await Promise.all([
    supabase.from('batches').select('*'),
    supabase.from('ingredients').select('*'),
    supabase.from('gravity_readings').select('*'),
    supabase.from('recipes').select('*'),
    supabase.from('reminders').select('*'),
  ]);

  return {
    exportDate: new Date().toISOString(),
    batches: batches.data || [],
    ingredients: ingredients.data || [],
    gravity_readings: readings.data || [],
    recipes: recipes.data || [],
    reminders: reminders.data || [],
  };
}
