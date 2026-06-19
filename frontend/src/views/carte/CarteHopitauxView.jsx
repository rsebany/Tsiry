import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LegacyCard from '../../components/ui/LegacyCard.jsx';
import StatusMessage from '../../components/ui/StatusMessage.jsx';
import useCarteHopitauxFetch from './fetch/useCarteHopitauxFetch.js';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER = [-18.9136, 47.521];

export default function CarteHopitauxView() {
  const { hopitaux, error } = useCarteHopitauxFetch();

  return (
    <LegacyCard
      title="Cartographie des établissements"
      description="Hôpitaux et cliniques à Antananarivo (UC11 — Clova)."
      className="carte-hopitaux"
    >
      {error && <StatusMessage variant="error" message={error} />}

      <div className="carte-map-wrap">
        <MapContainer center={DEFAULT_CENTER} zoom={13} scrollWheelZoom className="carte-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {hopitaux.map((h) => (
            <Marker key={h.id_hopital} position={[Number(h.latitude), Number(h.longitude)]}>
              <Popup>
                <strong>{h.nom}</strong>
                <br />
                {h.type}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {hopitaux.length > 0 && (
        <ul className="carte-list">
          {hopitaux.map((h) => (
            <li key={h.id_hopital}>
              <strong>{h.nom}</strong> — {h.type}
            </li>
          ))}
        </ul>
      )}
    </LegacyCard>
  );
}
