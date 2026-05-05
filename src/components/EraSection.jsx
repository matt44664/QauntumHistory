import { useEffect, useRef } from 'react';
import MilestoneCard from './MilestoneCard.jsx';

export default function EraSection({ era, milestones, onSelectMilestone, onEraVisible }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onEraVisible(era.id);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [era.id, onEraVisible]);

  return (
    <section
      id={`era-${era.id}`}
      ref={sectionRef}
      className="era-section"
      style={{ '--accent': era.accent, '--accent-rgb': era.accentRgb }}
    >
      <div className="era-header">
        <div className="era-number-badge">{era.number}</div>
        <div className="era-header-text">
          <h2 className="era-name">{era.name}</h2>
          <span className="era-years">{era.years}</span>
          <p className="era-description">{era.description}</p>
        </div>
      </div>

      <div className="era-spine-container">
        <div className="era-spine" />
        <div className="milestones-list">
          {milestones.map((m, i) => (
            <MilestoneCard
              key={m.id}
              milestone={m}
              eraAccent={era.accent}
              eraAccentRgb={era.accentRgb}
              index={i}
              onSelect={onSelectMilestone}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
