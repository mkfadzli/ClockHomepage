import { useEffect, useState } from 'react';

const TONES_MANIFEST_URL = '/tones/manifest.json';

export const toneUrl = (filename) =>
  `/tones/${filename.split('/').map(encodeURIComponent).join('/')}`;

export default function useTones() {
  const [tones, setTones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadTones = async () => {
      try {
        const response = await fetch(`${TONES_MANIFEST_URL}?t=${Date.now()}`);
        if (!response.ok) throw new Error('manifest unavailable');
        const data = await response.json();
        if (!cancelled) {
          setTones(Array.isArray(data.tones) ? data.tones : []);
        }
      } catch {
        if (!cancelled) setTones([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadTones();

    return () => {
      cancelled = true;
    };
  }, []);

  return { tones, loading };
}
