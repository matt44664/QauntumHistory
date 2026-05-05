import { useScrollReveal } from '../hooks/useScrollReveal.js';

export default function MilestoneCard({ milestone, eraAccent, eraAccentRgb, index, onSelect }) {
  const [ref, isVisible] = useScrollReveal(0.1);
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`milestone-card ${isVisible ? 'revealed' : ''} ${isEven ? 'even' : 'odd'}`}
      style={{ '--accent': eraAccent, '--accent-rgb': eraAccentRgb, '--delay': `${(index % 4) * 80}ms` }}
      onClick={() => onSelect(milestone)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(milestone)}
      aria-label={`${milestone.year} — ${milestone.title} by ${milestone.scientist}`}
    >
      <div className="card-connector">
        <div className="connector-line" />
        <div className="connector-dot" />
      </div>
      <div className="card-body">
        <div className="card-header">
          <span className="card-year">{milestone.year}</span>
          <span className="card-scientist">{milestone.scientist}</span>
          {milestone.country && <span className="card-country">{milestone.country}</span>}
        </div>
        <h3 className="card-title">{milestone.title}</h3>
        <p className="card-summary">{milestone.summary}</p>
        <div className="card-footer">
          {milestone.equation && (
            <code className="card-eq">{milestone.equation}</code>
          )}
          <span className="card-cta">Read more →</span>
        </div>
      </div>
    </div>
  );
}
