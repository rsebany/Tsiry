import useApi from '@/hooks/useApi';
import { getHopitaux } from '@/services/urgenceService';

// ============ OWNER: Clova (UC11 - carte) ============
export default function useCarteHopitaux() {
  const { data: hopitaux = [], error, loading } = useApi(getHopitaux);
  return { hopitaux, error, loading };
}
