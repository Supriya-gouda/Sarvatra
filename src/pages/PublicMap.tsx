import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import RealMap from "@/components/RealMap";
import {
  MapPin,
  AlertTriangle,
  RefreshCw,
  Activity,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { reportApi, alertApi } from "@/lib/api";

export default function PublicMap() {
  const [reports, setReports] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAlerts, setShowAlerts] = useState(true);
  const [showReports, setShowReports] = useState(true);
  const [stats, setStats] = useState({
    totalReports: 0,
    activeAlerts: 0,
    verifiedReports: 0
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch reports and alerts
      const [reportsResponse, alertsResponse] = await Promise.all([
        reportApi.getReports({ status: 'approved' }),
        alertApi.getActiveAlerts()
      ]);

      setReports(reportsResponse.reports || reportsResponse || []);
      setAlerts(alertsResponse.alerts || alertsResponse || []);

      // Calculate stats
      const allReports = reportsResponse.reports || reportsResponse || [];
      setStats({
        totalReports: allReports.length,
        activeAlerts: (alertsResponse.alerts || alertsResponse || []).length,
        verifiedReports: allReports.filter((r: any) => r.status === 'approved').length
      });

      toast.success('Map data refreshed');
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load map data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredReports = showReports ? reports : [];
  const filteredAlerts = showAlerts ? alerts : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Stats */}
      <div className="border-b bg-card p-4 md:p-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Live Disaster Map</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Real-time visualization of disasters and alerts
              </p>
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="flex gap-2">
                <Badge variant="outline" className="gap-1">
                  <Activity className="h-3 w-3" />
                  {stats.totalReports} Reports
                </Badge>
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {stats.activeAlerts} Alerts
                </Badge>
                <Badge variant="default" className="gap-1">
                  <Shield className="h-3 w-3" />
                  {stats.verifiedReports} Verified
                </Badge>
              </div>
              
              <Button 
                size="sm" 
                variant="outline" 
                onClick={fetchData}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Controls Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Map Layers</CardTitle>
                <CardDescription className="text-xs">
                  Toggle data visibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="show-alerts" 
                    checked={showAlerts}
                    onCheckedChange={(checked) => setShowAlerts(checked as boolean)}
                  />
                  <Label htmlFor="show-alerts" className="flex items-center gap-2 cursor-pointer">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm">Official Alerts ({stats.activeAlerts})</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="show-reports" 
                    checked={showReports}
                    onCheckedChange={(checked) => setShowReports(checked as boolean)}
                  />
                  <Label htmlFor="show-reports" className="flex items-center gap-2 cursor-pointer">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">Citizen Reports ({stats.totalReports})</span>
                  </Label>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-2">Legend</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>High Trust (70%+)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span>Medium Trust (40-70%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Low Trust (&lt;40%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span>Official Alerts</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Reports</span>
                  <span className="font-bold">{stats.totalReports}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Alerts</span>
                  <span className="font-bold text-destructive">{stats.activeAlerts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Verified</span>
                  <span className="font-bold text-green-600">{stats.verifiedReports}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map View */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-0">
                <RealMap 
                  reports={filteredReports}
                  alerts={filteredAlerts}
                  height="700px"
                  showControls={false}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
