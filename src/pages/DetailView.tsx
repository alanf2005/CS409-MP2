import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getIngredients, useMeals } from '../api';
import styles from '../styles.module.css';

interface DetailState {
  ids?: string[];
}

export default function DetailView() {
  const { id = '' } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { meals, loading, error } = useMeals();

  if (loading) return <p className={styles.status}>Loading meal…</p>;
  if (error) return <p className={`${styles.status} ${styles.error}`}>{error}</p>;

  const passed = (location.state as DetailState | null)?.ids;
  const ids = passed && passed.includes(id) ? passed : meals.map((m) => m.idMeal);
  const index = ids.indexOf(id);
  const meal = meals.find((m) => m.idMeal === id);

  if (!meal || index === -1) {
    return <p className={styles.status}>Meal not found.</p>;
  }

  const goTo = (i: number) => {
    const wrapped = (i + ids.length) % ids.length;
    navigate(`/meal/${ids[wrapped]}`, { state: { ids } });
  };

  const tags = meal.strTags?.split(',').map((t) => t.trim()).filter(Boolean) ?? [];
  const steps = meal.strInstructions.split(/\r?\n/).filter((p) => p.trim());

  return (
    <section>
      <div className={styles.detailNav}>
        <button type="button" className={styles.navButton} onClick={() => goTo(index - 1)}>
          ← Previous
        </button>
        <span className={styles.position}>{index + 1} of {ids.length}</span>
        <button type="button" className={styles.navButton} onClick={() => goTo(index + 1)}>
          Next →
        </button>
      </div>

      <article className={styles.detail}>
        <img className={styles.detailImg} src={meal.strMealThumb} alt={meal.strMeal} />
        <div>
          <h2 className={styles.detailTitle}>{meal.strMeal}</h2>
          <div className={styles.tags}>
            <span className={styles.tag}>{meal.strCategory}</span>
            <span className={styles.tag}>{meal.strArea}</span>
            {tags.map((t) => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </div>

          <h3 className={styles.sectionTitle}>Ingredients</h3>
          <ul className={styles.ingredients}>
            {getIngredients(meal).map((item, i) => (
              <li key={i}>
                {item.measure} {item.ingredient}
              </li>
            ))}
          </ul>

          <h3 className={styles.sectionTitle}>Instructions</h3>
          <div className={styles.instructions}>
            {steps.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {meal.strYoutube && (
            <a className={styles.link} href={meal.strYoutube} target="_blank" rel="noreferrer">
              Watch on YouTube ↗
            </a>
          )}
        </div>
      </article>
    </section>
  );
}