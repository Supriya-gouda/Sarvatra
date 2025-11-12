import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

// Fix Leaflet default icon issue with Vite
import L from 'leaflet';

// Delete the default icon URL getter
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Set default icon options
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Report {
  id: string;
  latitude: number;
  longitude: number;
  disaster_type: string;
  description: string;
  trust_score?: number;
  status: string;
  created_at: string;
}

interface Alert {
  id: string;
  latitude: number;
  longitude: number;
  severity: string;
  event_type: string;
  headline: string;
  description: string;
}

interface RealMapProps {
  reports?: Report[];
  alerts?: Alert[];
  center?: LatLngExpression;
  zoom?: number;
  height?: string;
  showControls?: boolean;
}

// Component to update map view
function MapUpdater({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Custom icons for different disaster types
const getDisasterIcon = (disasterType: string, trustScore?: number) => {
  const color = trustScore && trustScore >= 70 ? 'green' :
                trustScore && trustScore >= 40 ? 'orange' : 'red';
  
  return new Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const getAlertIcon = (severity: string) => {
  const color = severity === 'Extreme' ? 'red' :
                severity === 'Severe' ? 'orange' :
                severity === 'Moderate' ? 'yellow' : 'blue';
  
  return new Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

export default function RealMap({ 
  reports = [], 
  alerts = [], 
  center = [20.5937, 78.9629], // India center
  zoom = 5,
  height = '500px',
  showControls = true
}: RealMapProps) {
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(center);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation && center === mapCenter) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation: LatLngExpression = [
            position.coords.latitude,
            position.coords.longitude
          ];
          setMapCenter(userLocation);
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  return (
    <div style={{ height, width: '100%', position: 'relative' }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
        scrollWheelZoom={true}
      >
        <MapUpdater center={mapCenter} />
        
        {/* Base map layer - OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render disaster reports */}
        {reports.map((report) => (
          <Marker
            key={`report-${report.id}`}
            position={[report.latitude, report.longitude]}
            icon={getDisasterIcon(report.disaster_type, report.trust_score)}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-sm mb-1">{report.disaster_type}</h3>
                <p className="text-xs text-gray-600 mb-2">{report.description}</p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant={report.status === 'approved' ? 'default' : 'secondary'}>
                    {report.status}
                  </Badge>
                  {report.trust_score && (
                    <Badge variant={report.trust_score >= 70 ? 'default' : 'destructive'}>
                      Trust: {report.trust_score}%
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(report.created_at).toLocaleString()}
                </p>
              </div>
            </Popup>
            {/* Circle to show affected area */}
            <Circle
              center={[report.latitude, report.longitude]}
              radius={2000} // 2km radius
              pathOptions={{
                color: report.trust_score && report.trust_score >= 70 ? '#22c55e' :
                       report.trust_score && report.trust_score >= 40 ? '#f97316' : '#ef4444',
                fillColor: report.trust_score && report.trust_score >= 70 ? '#22c55e' :
                          report.trust_score && report.trust_score >= 40 ? '#f97316' : '#ef4444',
                fillOpacity: 0.1,
                weight: 2
              }}
            />
          </Marker>
        ))}

        {/* Render official alerts */}
        {alerts.map((alert) => (
          <Marker
            key={`alert-${alert.id}`}
            position={[alert.latitude, alert.longitude]}
            icon={getAlertIcon(alert.severity)}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-sm mb-1">{alert.headline}</h3>
                <p className="text-xs text-gray-600 mb-2">{alert.description}</p>
                <div className="flex gap-2">
                  <Badge variant={
                    alert.severity === 'Extreme' ? 'destructive' :
                    alert.severity === 'Severe' ? 'default' : 'secondary'
                  }>
                    {alert.severity}
                  </Badge>
                  <Badge variant="outline">{alert.event_type}</Badge>
                </div>
              </div>
            </Popup>
            {/* Larger circle for alerts */}
            <Circle
              center={[alert.latitude, alert.longitude]}
              radius={5000} // 5km radius
              pathOptions={{
                color: alert.severity === 'Extreme' ? '#ef4444' :
                       alert.severity === 'Severe' ? '#f97316' : '#eab308',
                fillColor: alert.severity === 'Extreme' ? '#ef4444' :
                          alert.severity === 'Severe' ? '#f97316' : '#eab308',
                fillOpacity: 0.15,
                weight: 2,
                dashArray: '5, 10'
              }}
            />
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      {showControls && (
        <Card className="absolute bottom-4 right-4 p-3 bg-white/95 backdrop-blur z-[1000]">
          <div className="text-xs space-y-1">
            <div className="font-bold mb-2">Legend</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>High Trust (70%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Medium Trust (40-70%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Low Trust (&lt;40%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Official Alerts</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
