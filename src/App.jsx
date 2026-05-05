import { useState, useCallback } from 'react';
import ParticleField from './components/ParticleField.jsx';
import Hero from './components/Hero.jsx';
import Navigation from './components/Navigation.jsx';
import Timeline from './components/Timeline.jsx';
import MilestoneModal from './components/MilestoneModal.jsx';

export default function App() {
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [currentEraId, setCurrentEraId] = useState('classical-cracks');

  const handleSelectMilestone = useCallback(m => setSelectedMilestone(m), []);
  const handleCloseModal = useCallback(() => setSelectedMilestone(null), []);
  const handleEraChange = useCallback(id => setCurrentEraId(id), []);

  return (
    <>
      <ParticleField />
      <Navigation currentEraId={currentEraId} />
      <Hero />
      <Timeline
        onSelectMilestone={handleSelectMilestone}
        onEraChange={handleEraChange}
      />
      <MilestoneModal
        milestone={selectedMilestone}
        onClose={handleCloseModal}
      />
    </>
  );
}
