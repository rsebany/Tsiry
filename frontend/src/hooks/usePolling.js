import { useCallback, useEffect, useState } from 'react';

export default function usePolling(fetchFn, intervalMs, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      const result = await fetchFn();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await fetchFn();
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
      setError(err?.message || 'Hadisoana tamin\'ny fametrahana');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    setLoading(true);
    load();
    const interval = setInterval(load, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs, ...deps]);

  return { data, error, loading, reload };
}
