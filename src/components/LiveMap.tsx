import { MapPin, AlertTriangle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MapPin {
  id: string;
  type: 'report' | 'alert';
  latitude: number;
  longitude: number;
  trustScore?: number;
  eventType?: string;
  severity?: string;
}

interface LiveMapProps {
  reports: any[];
  alerts: any[];
}

export default function LiveMap({ reports, alerts }: LiveMapProps) {
  // Create pins from reports and alerts
  const reportPins: MapPin[] = reports.map(report => ({
    id: report.id,
    type: 'report',
    latitude: report.latitude,
    longitude: report.longitude,
    trustScore: report.trustScore || report.trust_score
  }));

  const alertPins: MapPin[] = alerts.map((alert, index) => ({
    id: alert.alert_id || alert.id || `alert-${index}`,
    type: 'alert',
    latitude: 19.0760 + (Math.random() - 0.5) * 0.1, // Mock location near Mumbai
    longitude: 72.8777 + (Math.random() - 0.5) * 0.1,
    eventType: alert.event_type || alert.eventType,
    severity: alert.severity
  }));

  const allPins = [...reportPins, ...alertPins];

  // Calculate bounds
  const latitudes = allPins.map(p => p.latitude).filter(Boolean);
  const longitudes = allPins.map(p => p.longitude).filter(Boolean);
  
  const centerLat = latitudes.length > 0 
    ? latitudes.reduce((a, b) => a + b, 0) / latitudes.length 
    : 19.0760;
  const centerLon = longitudes.length > 0
    ? longitudes.reduce((a, b) => a + b, 0) / longitudes.length
    : 72.8777;

  // Simple SVG-based map visualization
  const width = 100; // percentage
  const height = 100; // percentage
  const scale = 500; // pixels per degree

  const getTrustColor = (score?: number) => {
    if (!score) return 'hsl(var(--muted))';
    if (score >= 75) return 'hsl(var(--success))';
    if (score >= 50) return 'hsl(var(--primary))';
    if (score >= 25) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  const getSeverityColor = (severity?: string) => {
    const sev = severity?.toLowerCase();
    if (sev === 'critical' || sev === 'extreme' || sev === 'high') return 'hsl(var(--destructive))';
    if (sev === 'moderate' || sev === 'medium') return 'hsl(var(--warning))';
    return 'hsl(var(--muted))';
  };

  return (
    <div className="relative w-full h-full bg-muted/20 rounded-lg overflow-hidden">
      {/* Map Canvas */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
        {/* Grid lines for reference */}
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-muted/20"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Map Pins */}
        <div className="absolute inset-0">
          {allPins.map((pin, index) => {
            // Convert lat/lon to screen coordinates
            const x = ((pin.longitude - centerLon) * scale + 50);
            const y = ((centerLat - pin.latitude) * scale + 50);

            return (
              <div
                key={pin.id || index}
                className="absolute transform -translate-x-1/2 -translate-y-full transition-all hover:scale-125 cursor-pointer group"
                style={{
                  left: `${x}%`,
                  top: `${y}%`
                }}
              >
                {pin.type === 'report' ? (
                  <div className="relative">
                    <MapPin
                      className="h-8 w-8 drop-shadow-lg"
                      style={{ color: getTrustColor(pin.trustScore) }}
                      fill="currentColor"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pt-2">
                      <Users className="h-3 w-3 text-white" />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-popover text-popover-foreground text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
                        <div className="font-semibold">Citizen Report</div>
                        <div>Trust: {pin.trustScore || 'N/A'}/100</div>
                        <div className="text-muted-foreground">
                          {pin.latitude.toFixed(4)}, {pin.longitude.toFixed(4)}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-pulse"
                      style={{ backgroundColor: getSeverityColor(pin.severity) }}
                    >
                      <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-popover text-popover-foreground text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
                        <div className="font-semibold">Official Alert</div>
                        <div>{pin.eventType}</div>
                        <div>
                          <Badge variant="destructive" className="text-xs">{pin.severity}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Map Info Overlay */}
        <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="text-xs space-y-1">
            <div className="font-semibold">Real-time Locations</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" style={{ color: 'hsl(var(--success))' }} />
                <span className="text-muted-foreground">{reportPins.length} Reports</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-destructive" />
                <span className="text-muted-foreground">{alertPins.length} Alerts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-primary rounded-full"></div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button className="bg-card hover:bg-accent text-card-foreground rounded p-2 shadow-lg transition-colors">
          <span className="text-lg font-bold">+</span>
        </button>
        <button className="bg-card hover:bg-accent text-card-foreground rounded p-2 shadow-lg transition-colors">
          <span className="text-lg font-bold">-</span>
        </button>
      </div>
    </div>
  );
}
