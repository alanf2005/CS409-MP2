import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import ListView from './pages/ListView';
import GalleryView from './pages/GalleryView';
import DetailView from './pages/DetailView';
import styles from './styles.module.css';

function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
}

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Meal Finder</h1>
        <nav className={styles.nav}>
          <NavLink to="/" end className={navClass}>Search</NavLink>
          <NavLink to="/gallery" className={navClass}>Gallery</NavLink>
        </nav>
      </header>
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<ListView />} />
          <Route path="/gallery" element={<GalleryView />} />
          <Route path="/meal/:id" element={<DetailView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;