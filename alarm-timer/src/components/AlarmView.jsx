import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import useTime from '../hooks/useTime';

const DEFAULT_SOUND = 'Hamidshax - Dreams (Original Mix).wav';

/**
 * AlarmView — alarm clock manager.
 *
 * - Add / delete alarms with optional labels
 * - Alarms persist in localStorage
 * - Plays audio file when an enabled alarm matches the current HH:MM
 * - Dismiss button stops playback
 */
const AlarmView = () => {
  const [alarms, setAlarms] = useState(() => {
    try {
      const saved = localStorage.getItem('alarms');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [newAlarmTime, setNewAlarmTime] = useState('');
  const [newAlarmLabel, setNewAlarmLabel] = useState('');
  const [newAlarmSound, setNewAlarmSound] = useState(DEFAULT_SOUND);
  const [activeAlarmId, setActiveAlarmId] = useState(null);

  const audioRef = useRef(null);
  const time = useTime();

  /* ── Persist to localStorage ── */
  useEffect(() => {
    localStorage.setItem('alarms', JSON.stringify(alarms));
  }, [alarms]);

  /* ── Check for triggered alarms ── */
  useEffect(() => {
    const currentTime = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;

    for (const alarm of alarms) {
      if (alarm.enabled && alarm.time === currentTime) {
        // Already playing this alarm
        if (activeAlarmId === alarm.id) return;

        setActiveAlarmId(alarm.id);
        const audio = audioRef.current;
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(() => {
            /* browser may block autoplay — user gesture required */
          });
        }
        return; // only fire one alarm per minute
      }
    }

    // No alarm matched this tick — clear if we own the active one
    if (activeAlarmId !== null) {
      const stillValid = alarms.some(
        (a) => a.id === activeAlarmId && a.enabled && a.time === currentTime
      );
      if (!stillValid) {
        setActiveAlarmId(null);
        const audio = audioRef.current;
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      }
    }
  }, [time, alarms, activeAlarmId]);

  /* ── Actions ── */
  const addAlarm = useCallback(() => {
    if (!newAlarmTime) return;
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    setAlarms((prev) => [
      ...prev,
      {
        id,
        time: newAlarmTime,
        label: newAlarmLabel.trim() || '',
        sound: newAlarmSound,
        enabled: true,
      },
    ]);
    setNewAlarmTime('');
    setNewAlarmLabel('');
    setNewAlarmSound(DEFAULT_SOUND);
    setShowModal(false);
  }, [newAlarmTime, newAlarmLabel, newAlarmSound]);

  const deleteAlarm = useCallback((id) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
    if (activeAlarmId === id) {
      setActiveAlarmId(null);
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    }
  }, [activeAlarmId]);

  const toggleAlarm = useCallback((id) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  }, []);

  const dismissAlarm = useCallback(() => {
    setActiveAlarmId(null);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  const activeAlarm = alarms.find((a) => a.id === activeAlarmId);

  /* ── Render ── */
  return (
    <div className="alarm-container">
      {/* Hidden audio element — src determined at render */}
      <audio
        ref={audioRef}
        src={activeAlarm ? `/sounds/${activeAlarm.sound}` : undefined}
        loop
        preload="auto"
      />

      {/* Active alarm banner */}
      {activeAlarm && (
        <div className="alarm-active-banner">
          <div className="alarm-active-info">
            <span className="alarm-active-icon">🔔</span>
            <span>{activeAlarm.label || activeAlarm.time}</span>
          </div>
          <button className="alarm-dismiss-btn" onClick={dismissAlarm}>
            Dismiss
          </button>
        </div>
      )}

      {/* Alarm list */}
      <div className="alarm-list">
        {alarms.length === 0 && (
          <p className="alarm-empty">No alarms set</p>
        )}
        {alarms.map((alarm) => (
          <div key={alarm.id} className={`alarm-item ${!alarm.enabled ? 'disabled' : ''}`}>
            <div className="alarm-item-left">
              <button
                className={`alarm-toggle ${alarm.enabled ? 'on' : ''}`}
                onClick={() => toggleAlarm(alarm.id)}
                aria-label={alarm.enabled ? 'Disable alarm' : 'Enable alarm'}
              >
                <div className="alarm-toggle-knob" />
              </button>
              <div className="alarm-item-info">
                <span className="alarm-item-time">{alarm.time}</span>
                {alarm.label && <span className="alarm-item-label">{alarm.label}</span>}
              </div>
            </div>
            <button
              className="alarm-delete-btn"
              onClick={() => deleteAlarm(alarm.id)}
              aria-label="Delete alarm"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Add button */}
      <button className="alarm-add-btn" onClick={() => setShowModal(true)}>
        <Plus size={20} />
        Add Alarm
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>New Alarm</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <label className="modal-label">Time</label>
              <input
                type="time"
                className="modal-input"
                value={newAlarmTime}
                onChange={(e) => setNewAlarmTime(e.target.value)}
                autoFocus
              />

              <label className="modal-label">Label (optional)</label>
              <input
                type="text"
                className="modal-input"
                placeholder="e.g. Morning workout"
                value={newAlarmLabel}
                onChange={(e) => setNewAlarmLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addAlarm();
                }}
              />

              <label className="modal-label">Sound</label>
              <select
                className="modal-input"
                value={newAlarmSound}
                onChange={(e) => setNewAlarmSound(e.target.value)}
              >
                <option value="Hamidshax - Dreams (Original Mix).wav">
                  Hamidshax — Dreams
                </option>
              </select>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={addAlarm}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlarmView;
