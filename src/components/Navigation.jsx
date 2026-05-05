import { eras } from '../data/eras.js';

export default function Navigation({ currentEraId }) {
  const scrollToEra = eraId => {
    const el = document.getElementById(`era-${eraId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="side-nav" aria-label="Era navigation">
      {eras.map(era => (
        <button
          key={era.id}
          className={`nav-dot ${currentEraId === era.id ? 'active' : ''}`}
          style={{ '--accent': era.accent }}
          onClick={() => scrollToEra(era.id)}
          title={`${era.number}. ${era.name} (${era.years})`}
          aria-label={`Navigate to ${era.name}`}
        >
          <span className="nav-dot-pip" />
          <span className="nav-dot-label">
            <strong>{era.number}</strong> {era.name}
          </span>
        </button>
      ))}
    </nav>
  );
}
