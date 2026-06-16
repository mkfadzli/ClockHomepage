import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import useTones, { toneUrl } from '../hooks/useTones';

/**
 * TimerView — countdown timer with progress ring.
 *
 * - Start via preset buttons (1 / 5 / 10 / 15 minutes)
 * - Pause / Resume / Reset (restart from original duration)
 * - SVG progress ring that drains clockwise
 * - Plays a tone from /public/tones when the countdown finishes
 */

const TIMER_TONE_KEY = 'timerTone';

const formatTime = (totalSeconds) => {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hrs > 0) {
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const TimerView = () => {
  const { tones, loading: tonesLoading } = useTones();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(0);
  const [selectedTone, setSelectedTone] = useState(() => {
    try {
      return localStorage.getItem(TIMER_TONE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [isRinging, setIsRinging] = useState(false);

  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (tones.length === 0) return;

    setSelectedTone((current) => {
      if (current && tones.includes(current)) return current;
      return tones[0];
    });
  }, [tones]);

  useEffect(() => {
    if (!selectedTone) return;
    try {
      localStorage.setItem(TIMER_TONE_KEY, selectedTone);
    } catch {
      /* ignore storage errors */
    }
  }, [selectedTone]);

  const stopTone = useCallback(() => {
    setIsRinging(false);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  const playTone = useCallback(() => {
    if (!selectedTone) return;

    setIsRinging(true);
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        /* browser may block autoplay until user interacts */
      });
    }
  }, [selectedTone]);

  /* ── Cleanup interval on unmount ── */
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  /* ── Tick ── */
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          playTone();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, playTone]);

  /* ── Controls ── */
  const startTimer = useCallback((seconds) => {
    stopTone();
    setDuration(seconds);
    setTimeLeft(seconds);
    setIsRunning(true);
  }, [stopTone]);

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    stopTone();
    setIsRunning(false);
    setTimeLeft(duration);
  }, [duration, stopTone]);

  // Progress: 100 = full, 0 = empty (ring drains clockwise)
  const progress = duration > 0 ? (timeLeft / duration) * 100 : 0;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="timer-container">
      <audio
        ref={audioRef}
        src={selectedTone ? toneUrl(selectedTone) : undefined}
        loop
        preload="auto"
      />

      {isRinging && (
        <div className="timer-active-banner">
          <div className="timer-active-info">
            <span className="timer-active-icon">⏰</span>
            <span>Timer finished</span>
          </div>
          <button className="timer-dismiss-btn" onClick={stopTone}>
            Dismiss
          </button>
        </div>
      )}

      <div className="timer-tone-picker">
        <label className="timer-tone-label" htmlFor="timer-tone">
          Tone
        </label>
        <select
          id="timer-tone"
          className="timer-tone-select"
          value={selectedTone}
          onChange={(e) => setSelectedTone(e.target.value)}
          disabled={tonesLoading || tones.length === 0}
        >
          {tones.length === 0 ? (
            <option value="">
              {tonesLoading ? 'Loading tones…' : 'Add audio files to public/tones'}
            </option>
          ) : (
            tones.map((tone) => (
              <option key={tone} value={tone}>
                {tone.replace(/\.[^.]+$/, '')}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="timer-circle">
        <svg className="progress-ring" viewBox="0 0 200 200">
          <circle
            cx="100" cy="100" r="90"
            fill="none"
            stroke="rgba(6, 182, 212, 0.1)"
            strokeWidth="8"
          />
          <circle
            cx="100" cy="100" r="90"
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 100 100)"
            style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="timer-display">
          {timeLeft > 0 ? formatTime(timeLeft) : '00:00'}
        </div>
      </div>

      <div className="preset-buttons">
        <button className="preset-btn" onClick={() => startTimer(60)}>1m</button>
        <button className="preset-btn" onClick={() => startTimer(300)}>5m</button>
        <button className="preset-btn" onClick={() => startTimer(600)}>10m</button>
        <button className="preset-btn" onClick={() => startTimer(900)}>15m</button>
      </div>

      <div className="timer-controls">
        {timeLeft > 0 && (
          <>
            <button className="control-btn" onClick={toggleTimer}>
              {isRunning ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button className="control-btn" onClick={resetTimer}>
              <RotateCcw size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TimerView;
