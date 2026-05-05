import { useCallback } from 'react';
import EraSection from './EraSection.jsx';
import { eras } from '../data/eras.js';
import { milestones } from '../data/milestones.js';

export default function Timeline({ onSelectMilestone, onEraChange }) {
  const handleEraVisible = useCallback(eraId => {
    onEraChange(eraId);
  }, [onEraChange]);

  return (
    <main id="timeline" className="timeline">
      {eras.map(era => {
        const eraMilestones = milestones.filter(m => m.eraId === era.id);
        return (
          <EraSection
            key={era.id}
            era={era}
            milestones={eraMilestones}
            onSelectMilestone={onSelectMilestone}
            onEraVisible={handleEraVisible}
          />
        );
      })}
      <footer className="timeline-footer">
        <div className="footer-inner">
          <div className="footer-glow" />
          <p className="footer-quote">
            "Anyone who is not shocked by quantum theory has not understood it."
          </p>
          <p className="footer-attribution">— Niels Bohr</p>
          <p className="footer-note">
            From Thomas Young's candle flame to Google's quantum processor — 221 years of humanity confronting the impossible.
          </p>
        </div>
      </footer>
    </main>
  );
}
