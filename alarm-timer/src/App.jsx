/**
 * App.jsx — Firefox Homepage Dashboard
 *
 * Layout:
 *   1. Top-left stack (fixed):
 *      - Big clock (clock tab only)
 *      - Navigation tabs (Clock / Alarm / Timer)
 *   2. Centered column:
 *      - SearchBar
 *      - Bookmarks
 *      - Content area (Alarm / Timer views)
 *   3. Footer
 */

import React, { useState } from 'react';
import { Clock as ClockIcon, Bell, Timer } from 'lucide-react';

import SearchBar from './components/SearchBar';
import ClockView from './components/ClockView';
import AlarmView from './components/AlarmView';
import TimerView from './components/TimerView';
import Bookmarks from './components/Bookmarks';

import './styles.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('clock');

  return (
    <div className="app">
      {/* Top-left stack: big clock (clock tab only) + nav buttons */}
      <div className="top-left-stack">
        {activeTab === 'clock' && (
          <div className="big-clock-corner">
            <ClockView />
          </div>
        )}

        <nav className="nav">
          <button
            className={`nav-btn ${activeTab === 'clock' ? 'active' : ''}`}
            onClick={() => setActiveTab('clock')}
          >
            <ClockIcon size={16} />
            Clock
          </button>
          <button
            className={`nav-btn ${activeTab === 'alarm' ? 'active' : ''}`}
            onClick={() => setActiveTab('alarm')}
          >
            <Bell size={16} />
            Alarm
          </button>
          <button
            className={`nav-btn ${activeTab === 'timer' ? 'active' : ''}`}
            onClick={() => setActiveTab('timer')}
          >
            <Timer size={16} />
            Timer
          </button>
        </nav>
      </div>

      {/* Centered column: search + tab content */}
      <div className="center-column">
        <SearchBar />
        <Bookmarks />

        {/* Content area — Alarm / Timer views */}
        <div className="content">
          {activeTab === 'alarm' && <AlarmView />}
          {activeTab === 'timer' && <TimerView />}
        </div>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        by Fadzli Abdullah with ❤️ for mankind. 
      </footer>
    </div>
  );
};

export default App;
