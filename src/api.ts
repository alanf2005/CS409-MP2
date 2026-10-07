import axios from 'axios';
import { useEffect, useState } from 'react';
import type { Ingredient, Meal } from './types';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

let cache: Promise<Meal[]> | null = null;

// TheMealDB has no "get all" endpoint, so fetch every first letter once and cache it.
export function fetchAllMeals(): Promise<Meal[]> {
  if (!cache) {
    cache = Promise.all(
      LETTERS.map((letter) =>
        axios
          .get<{ meals: Meal[] | null }>(`${BASE_URL}/search.php`, { params: { f: letter } })
          .then((res) => res.data.meals ?? [])
          .catch(() => [] as Meal[]),
      ),
    ).then((groups) => {
      const meals = groups.flat().sort((a, b) => a.strMeal.localeCompare(b.strMeal));
      if (meals.length === 0) {
        cache = null;
        throw new Error('Could not load meals. TheMealDB may be down; please try again.');
      }
      return meals;
    });
  }
  return cache;
}

export function useMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchAllMeals()
      .then((data) => {
        if (active) {
          setMeals(data);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (active) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return { meals, loading, error };
}

export function getIngredients(meal: Meal): Ingredient[] {
  const items: Ingredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]?.trim();
    const measure = meal[`strMeasure${i}`]?.trim() ?? '';
    if (ingredient) items.push({ ingredient, measure });
  }
  return items;
}