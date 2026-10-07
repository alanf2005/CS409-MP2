import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMeals } from '../api';
import styles from '../styles.module.css';

export default function GalleryView() {
  const { meals, loading, error } = useMeals();
  const [selected, setSelected] = useState<string[]>([]);

  const categories = useMemo(
    () => [...new Set(meals.map((m) => m.strCategory))].sort(),
    [meals],
  );

  const shown = useMemo(
    () => (selected.length === 0 ? meals : meals.filter((m) => selected.includes(m.strCategory))),
    [meals, selected],
  );

  const ids = shown.map((m) => m.idMeal);

  const toggle = (cat: string) =>
    setSelected((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));

  return (
    <section>
      <h2 className={styles.title}>Gallery</h2>
      {loading && <p className={styles.status}>Loading meals…</p>}
      {error && <p className={`${styles.status} ${styles.error}`}>{error}</p>}
      {!loading && !error && (
        <>
          <div className={styles.filters}>
            <button
              type="button"
              className={selected.length === 0 ? `${styles.chip} ${styles.chipActive}` : styles.chip}
              aria-pressed={selected.length === 0}
              onClick={() => setSelected([])}
            >
              All
            </button>
            {categories.map((cat) => {
              const active = selected.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  className={active ? `${styles.chip} ${styles.chipActive}` : styles.chip}
                  aria-pressed={active}
                  onClick={() => toggle(cat)}
                >
                  {cat}
                </button>
              );
            })}
          </div>
          <p className={styles.count}>{shown.length} meals</p>
          <div className={styles.grid}>
            {shown.map((meal) => (
              <Link key={meal.idMeal} to={`/meal/${meal.idMeal}`} state={{ ids }} className={styles.card}>
                <img className={styles.cardImg} src={meal.strMealThumb} alt={meal.strMeal} loading="lazy" />
                <div className={styles.cardLabel}>{meal.strMeal}</div>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}