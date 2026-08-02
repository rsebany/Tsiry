import { useCallback, useEffect, useRef, useState } from 'react';

// // ============ OWNER: Jess (fondation) ============
// Chargement unique + reload manuel. Pour le polling, voir usePolling.
export default function useApi(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchFnRef = useRef(fetchFn);

  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchFnRef.current();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);

  return { data, error, loading, reload };
}
