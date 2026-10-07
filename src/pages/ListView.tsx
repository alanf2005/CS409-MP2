import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMeals } from '../api';
import styles from '../styles.module.css';

type SortKey = 'strMeal' | 'strCategory' | 'strArea' | 'idMeal';
type SortOrder = 'asc' | 'desc';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'strMeal', label: 'Name' },
  { value: 'strCategory', label: 'Category' },
  { value: 'strArea', label: 'Cuisine' },
  { value: 'idMeal', label: 'ID' },
];

export default function ListView() {
  const { meals, loading, error } = useMeals();
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('strMeal');
  const [order, setOrder] = useState<SortOrder>('asc');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = meals.filter((m) => m.strMeal.toLowerCase().includes(q));
    return [...filtered].sort((a, b) => {
      let cmp =
        sortKey === 'idMeal'
          ? Number(a.idMeal) - Number(b.idMeal)
          : a[sortKey].localeCompare(b[sortKey]);
      if (cmp === 0) cmp = a.strMeal.localeCompare(b.strMeal);
      return order === 'asc' ? cmp : -cmp;
    });
  }, [meals, query, sortKey, order]);

  const ids = results.map((m) => m.idMeal);

  return (
    <section>
      <h2 className={styles.title}>Search Meals</h2>
      <div className={styles.controls}>
        <label className={`${styles.field} ${styles.searchField}`}>
          Search
          <input
            className={styles.input}
            type="search"
            placeholder="Try “chicken” or “cake”…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className={styles.field}>
          Sort by
          <select
            className={styles.select}
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          Order
          <select
            className={styles.select}
            value={order}
            onChange={(e) => setOrder(e.target.value as SortOrder)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      {loading && <p className={styles.status}>Loading meals…</p>}
      {error && <p className={`${styles.status} ${styles.error}`}>{error}</p>}
      {!loading && !error && (
        <>
          <p className={styles.count}>{results.length} meals</p>
          {results.length === 0 ? (
            <p className={styles.status}>No meals match “{query}”.</p>
          ) : (
            <ul className={styles.list}>
              {results.map((meal) => (
                <li key={meal.idMeal}>
                  <Link to={`/meal/${meal.idMeal}`} state={{ ids }} className={styles.listItem}>
                    <img className={styles.thumb} src={meal.strMealThumb} alt="" loading="lazy" />
                    <div>
                      <h3 className={styles.itemName}>{meal.strMeal}</h3>
                      <p className={styles.itemMeta}>
                        {meal.strCategory} · {meal.strArea} · #{meal.idMeal}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}