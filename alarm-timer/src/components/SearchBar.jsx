/**
 * SearchBar — Firefox Homepage Search
 *
 * Supports two search providers:
 *   - Google           → https://www.google.com/search?q={query}
 *   - DuckDuckGo       → https://duckduckgo.com/?q={query}
 *
 * Provider state persists in localStorage.
 * Press Enter or click the search icon to open results in a new tab.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import './SearchBar.css';

const PROVIDERS = [
  {
    id: 'google',
    label: 'Google',
    icon: '🔍',
    searchUrl: (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    id: 'duckduckgo',
    label: 'DuckDuckGo',
    icon: '🦆',
    searchUrl: (q) => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
  },
];

const STORAGE_KEY = 'search_provider';

// Use env var as default when no localStorage value exists.
// Falls back to 'google' if VITE_DEFAULT_SEARCH_PROVIDER is not set.
const DEFAULT_PROVIDER = import.meta.env.VITE_DEFAULT_SEARCH_PROVIDER || 'google';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [providerId, setProviderId] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_PROVIDER;
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const currentProvider = PROVIDERS.find((p) => p.id === providerId) || PROVIDERS[0];

  // Persist provider choice
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, providerId);
  }, [providerId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Keyboard: / focuses search, Escape clears
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setQuery('');
        inputRef.current?.blur();
        setDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const executeSearch = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    window.open(currentProvider.searchUrl(trimmed), '_blank', 'noopener,noreferrer');
    // Don't clear — user may want to refine
  }, [query, currentProvider]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  const selectProvider = (id) => {
    setProviderId(id);
    setDropdownOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="searchbar-wrapper">
      <div className="searchbar-container">
        {/* Provider selector */}
        <div className="provider-selector" ref={dropdownRef}>
          <button
            className="provider-btn"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
            aria-label={`Search with ${currentProvider.label}. Click to change.`}
            type="button"
          >
            <span className="provider-icon" aria-hidden="true">
              {currentProvider.icon}
            </span>
            <span className="provider-label">{currentProvider.label}</span>
            <ChevronDown size={16} className={`chevron ${dropdownOpen ? 'open' : ''}`} />
          </button>

          {dropdownOpen && (
            <ul className="provider-dropdown" role="listbox" aria-label="Search providers">
              {PROVIDERS.map((p) => (
                <li
                  key={p.id}
                  role="option"
                  aria-selected={p.id === providerId}
                  className={`provider-option ${p.id === providerId ? 'selected' : ''}`}
                  onClick={() => selectProvider(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      selectProvider(p.id);
                    }
                  }}
                  tabIndex={0}
                >
                  <span className="provider-icon" aria-hidden="true">{p.icon}</span>
                  <span>{p.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search input */}
        <div className="search-input-group">
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder={`Search with ${currentProvider.label}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label={`Search the web using ${currentProvider.label}`}
            autoComplete="off"
            spellCheck="false"
          />
          <button
            className="search-btn"
            onClick={executeSearch}
            aria-label="Search"
            type="button"
          >
            <Search size={22} />
          </button>
        </div>
      </div>

      {/* Keyboard hint */}
      <p className="search-hint">
        Press <kbd>/</kbd> to focus · <kbd>Enter</kbd> to search · <kbd>Esc</kbd> to clear
      </p>
    </div>
  );
};

export default SearchBar;
