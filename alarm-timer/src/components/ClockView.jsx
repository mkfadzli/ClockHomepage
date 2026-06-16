import React from 'react';
import useTime from '../hooks/useTime';

/**
 * ClockView — full digital clock with animated seconds ring.
 * Shows HH:MM:SS in large Orbitron font with a circular
 * progress ring that tracks the current second.
 */
const ClockView = () => {
  const time = useTime();
  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');
  const date = time.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="clock-container">
      <div className="time-display">
        <div className="time-segment" style={{ animationDelay: '0s' }}>
          {hours}
        </div>
        <div className="time-separator">:</div>
        <div className="time-segment" style={{ animationDelay: '0.1s' }}>
          {minutes}
        </div>
        <div className="time-separator">:</div>
        <div className="time-segment seconds" style={{ animationDelay: '0.2s' }}>
          {seconds}
        </div>
      </div>
      <div className="date-display">{date}</div>
      <svg className="seconds-ring" viewBox="0 0 200 200">
        <circle
          cx="100" cy="100" r="90"
          fill="none"
          stroke="rgba(6, 182, 212, 0.1)"
          strokeWidth="2"
        />
        <circle
          cx="100" cy="100" r="90"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${(seconds / 60) * 565.5} 565.5`}
          transform="rotate(-90 100 100)"
          style={{ transition: 'stroke-dasharray 0.3s ease-out' }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default ClockView;
