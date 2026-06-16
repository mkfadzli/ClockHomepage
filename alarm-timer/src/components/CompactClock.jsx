import React from 'react';
import useTime from '../hooks/useTime';

/**
 * CompactClock — minimal clock widget for the homepage hero area.
 * Shows HH:MM plus abbreviated date below the search bar.
 */
const CompactClock = () => {
  const time = useTime();
  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const date = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="compact-clock">
      <span className="compact-time">{hours}:{minutes}</span>
      <span className="compact-date">{date}</span>
    </div>
  );
};

export default CompactClock;
