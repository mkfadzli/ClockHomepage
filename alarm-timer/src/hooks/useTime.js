import { useState, useEffect } from 'react';

/**
 * useTime — live clock hook (ticks every 1 second)
 *
 * Returns a Date object that updates each second.
 * Firefox throttles background tabs to ~1 Hz, which is
 * acceptable for a homepage — seconds may stutter when
 * the tab is not focused.
 */
const useTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
};

export default useTime;
