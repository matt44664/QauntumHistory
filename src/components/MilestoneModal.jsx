import { useEffect, useCallback } from 'react';
import DoubleSlit from './DoubleSlit.jsx';
import { eras } from '../data/eras.js';

export default function MilestoneModal({ milestone, onClose }) {
  const era = eras.find(e => e.id === milestone?.eraId);

  const handleKey = useCallback(e => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (!milestone) return;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [milestone, handleKey]);

  if (!milestone) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={e => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={milestone.title}
    >
      <div
        className="modal-panel"
        style={{ '--accent': era?.accent, '--accent-rgb': era?.accentRgb }}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="modal-meta">
          <span className="modal-year">{milestone.year}</span>
          <span className="modal-era">{era?.name}</span>
        </div>

        <div className="modal-scientist-row">
          <div className="modal-avatar" aria-hidden="true">
            {milestone.scientist.charAt(0)}
          </div>
          <div>
            <h2 className="modal-title">{milestone.title}</h2>
            <p className="modal-scientist">{milestone.scientist}</p>
            {milestone.country && <p className="modal-country">{milestone.country}</p>}
          </div>
        </div>

        <div className="modal-body">
          <p className="modal-detail">{milestone.detail}</p>

          {milestone.equation && (
            <div className="modal-equation-block">
              <span className="eq-label">Key Equation / Concept</span>
              <code className="eq-formula">{milestone.equation}</code>
              {milestone.equationLabel && (
                <span className="eq-caption">{milestone.equationLabel}</span>
              )}
            </div>
          )}

          {milestone.hasSimulation && (
            <div className="modal-sim-section">
              <DoubleSlit />
            </div>
          )}

          <div className="modal-significance">
            <h4>Why It Mattered</h4>
            <p>{milestone.significance}</p>
          </div>

          <div className="modal-wowfact">
            <h4>Fascinating Detail</h4>
            <p>{milestone.wowFact}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
