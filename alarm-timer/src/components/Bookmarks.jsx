/**
 * Bookmarks — Quick AI links below the search bar.
 *
 * Perplexity, ChatGPT, Claude, DeepSeek, Grok, Qwen
 * Text-only chips. Each opens in a new tab.
 */

import React from 'react';
import './Bookmarks.css';

const BOOKMARKS = [
  { id: 'perplexity', label: 'Perplexity', url: 'https://www.perplexity.ai' },
  { id: 'chatgpt',    label: 'ChatGPT',    url: 'https://chat.openai.com' },
  { id: 'claude',     label: 'Claude',     url: 'https://claude.ai' },
  { id: 'deepseek',   label: 'DeepSeek',   url: 'https://chat.deepseek.com' },
  { id: 'grok',       label: 'Grok',       url: 'https://grok.com' },
  { id: 'qwen',       label: 'Qwen',       url: 'https://chat.qwen.ai' },
];

const Bookmarks = () => {
  return (
    <div className="bookmarks-row">
      {BOOKMARKS.map((b) => (
        <a
          key={b.id}
          href={b.url}
          className="bookmark-chip"
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={0}
        >
          {b.label}
        </a>
      ))}
    </div>
  );
};

export default Bookmarks;
