import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useCarteHopitaux from '@/features/carte/hooks/useCarteHopitaux';
import PageHeader from '@/components/PageHeader';
import DataState from '@/components/DataState';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // ============ OWNER: Clova (UC11 - cartographie) ============
// // TODO Clova: filtres par type (CHU, Privé, Public) et recherche d'établissement.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER = [-18.9136, 47.521];

export default function CarteHopitauxView() {
  const { hopitaux, error, loading } = useCarteHopitaux();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cartographie des établissements"
        description="Hôpitaux et cliniques à Antananarivo (UC11)."
      />

      <Card>
        <CardContent className="p-2">
          <DataState loading={loading} error={error}>
            <div className="h-[320px] w-full overflow-hidden rounded-lg sm:h-[520px]">
              <MapContainer
                center={DEFAULT_CENTER}
                zoom={13}
                scrollWheelZoom
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {hopitaux.map((h) => (
                  <Marker key={h.id_hopital} position={[Number(h.latitude), Number(h.longitude)]}>
                    <Popup>
                      <strong>{h.nom}</strong>
                      <br />
                      <Badge variant="secondary">{h.type}</Badge>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </DataState>
        </CardContent>
      </Card>

      {hopitaux.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {hopitaux.map((h) => (
            <Card key={h.id_hopital}>
              <CardContent className="flex items-center justify-between p-4">
                <p className="font-medium">{h.nom}</p>
                <Badge variant="outline">{h.type}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
