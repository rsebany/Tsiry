import { useEffect, useMemo, useState } from 'react';
import useApi from '@/hooks/useApi';
import { getHopitaux } from '@/services/urgenceService';

// Distance à vol d'oiseau (formule de Haversine), en kilomètres.
function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ============ OWNER: Clova (UC11 - carte) ============
export default function useCarteHopitaux() {
  const { data, error, loading } = useApi(getHopitaux);
  const hopitauxBruts = data || [];
  const [position, setPosition] = useState(null);
  const [positionError, setPositionError] = useState(null);
  const [typeFiltre, setTypeFiltre] = useState('TOUS');
  const [recherche, setRecherche] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setPositionError("Tsy misy fisakahana toerana amin'ity fitaovana ity.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setPositionError("Tsy ny toeranao — tsy mety isika ny lalana."),
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, []);

  const hopitaux = useMemo(() => {
    const withDistance = hopitauxBruts.map((h) => ({
      ...h,
      distanceKm: position
        ? distanceKm(position.lat, position.lng, Number(h.latitude), Number(h.longitude))
        : null,
    }));

    const filtres = withDistance.filter((h) => {
      const matchType = typeFiltre === 'TOUS' || h.type === typeFiltre;
      const matchRecherche = h.nom.toLowerCase().includes(recherche.toLowerCase());
      return matchType && matchRecherche;
    });

    return position
      ? [...filtres].sort((a, b) => a.distanceKm - b.distanceKm)
      : filtres;
  }, [hopitauxBruts, position, typeFiltre, recherche]);

  const types = useMemo(
    () => Array.from(new Set(hopitauxBruts.map((h) => h.type).filter(Boolean))),
    [hopitauxBruts]
  );

  const plusProche = position ? hopitaux[0] : null;

  return {
    hopitaux,
    total: hopitauxBruts.length,
    plusProche,
    types,
    typeFiltre,
    setTypeFiltre,
    recherche,
    setRecherche,
    positionDisponible: Boolean(position),
    position,
    positionError,
    error,
    loading,
  };
}
