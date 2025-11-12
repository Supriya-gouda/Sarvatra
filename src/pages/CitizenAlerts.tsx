import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { CheckCircle, AlertTriangle, XCircle, MessageCircle, MapPin, Clock, RefreshCw } from "lucide-react";
import { alertApi, feedbackApi } from "@/lib/api";
import Chatbot from "@/components/Chatbot";

interface Alert {
  id: string;
  alert_id?: string;
  event_type: string;
  area: string;
  severity: string;
  message: string;
  valid_from?: string;
  expires_at?: string;
  created_at?: string;
  responses?: {
    safe: number;
    need_help: number;
    false_alarm: number;
    total: number;
  };
}

export default function CitizenAlerts() {
  const [activeTab, setActiveTab] = useState("active");
  const [showChatbot, setShowChatbot] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch active alerts
  const fetchAlerts = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await alertApi.getActiveAlerts();
      
      if (Array.isArray(response)) {
        setAlerts(response);
      } else if (response?.data && Array.isArray(response.data)) {
        setAlerts(response.data);
      } else {
        console.warn('No alerts data received, using empty array');
        setAlerts([]);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error('Failed to load alerts. Showing cached data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAlerts();

    // Real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchAlerts(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle citizen response to alert
  const handleResponse = async (alertId: string, status: string) => {
    try {
      // Get user's location if available
      let latitude = 0;
      let longitude = 0;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
          },
          () => {
            console.log('Location not available');
          }
        );
      }

      await feedbackApi.submitResponse({
        alert_id: alertId,
        status,
        latitude,
        longitude,
        comment: null
      });

      toast.success(`✅ Your status updated: ${status}`);
      
      // Refresh to show updated counts (if backend returns them)
      fetchAlerts(true);
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error('Failed to submit response. Please try again.');
    }
  };

  // Manual refresh
  const handleManualRefresh = () => {
    fetchAlerts(true);
    toast.success('Refreshing alerts...');
  };

  // Severity badge variant
  const getSeverityVariant = (severity: string): "destructive" | "warning" | "default" => {
    const sev = severity?.toLowerCase();
    if (sev === 'critical' || sev === 'extreme' || sev === 'high') return 'destructive';
    if (sev === 'moderate' || sev === 'medium') return 'warning';
    return 'default';
  };

  // Time ago helper
  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Active Alerts & Status</h1>
            <p className="text-muted-foreground">
              Stay informed about disasters in your area and let us know if you're safe
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">
              Active Alerts ({alerts.length})
            </TabsTrigger>
            <TabsTrigger value="history">Response History</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading active alerts...</p>
              </div>
            ) : alerts.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-semibold mb-2">No Active Alerts</h3>
                  <p className="text-muted-foreground">
                    There are currently no disaster alerts in your area. Stay safe!
                  </p>
                </CardContent>
              </Card>
            ) : (
              alerts.map((alert) => (
                <Card key={alert.id || alert.alert_id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-xl">
                            {alert.event_type} Alert
                          </CardTitle>
                          <Badge variant={getSeverityVariant(alert.severity)}>
                            {alert.event_type}
                          </Badge>
                          <Badge variant="outline">{alert.severity} Risk</Badge>
                        </div>
                        <CardDescription className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {alert.area}
                        </CardDescription>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {getTimeAgo(alert.created_at || alert.valid_from)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <p className="text-sm">{alert.message}</p>

                    {/* Response Statistics */}
                    {alert.responses && alert.responses.total > 0 && (
                      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground">Community Response ({alert.responses.total} people):</p>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{alert.responses.safe}</div>
                            <div className="text-xs text-muted-foreground">Safe</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{alert.responses.need_help}</div>
                            <div className="text-xs text-muted-foreground">Need Help</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-600">{alert.responses.false_alarm}</div>
                            <div className="text-xs text-muted-foreground">False Alarm</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium mb-3">How are you doing?</p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          variant="outline"
                          className="flex-1 gap-2"
                          onClick={() => handleResponse(alert.alert_id || alert.id, 'safe')}
                        >
                          <CheckCircle className="h-4 w-4" />
                          I'm Safe
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 gap-2"
                          onClick={() => handleResponse(alert.alert_id || alert.id, 'need_help')}
                        >
                          <AlertTriangle className="h-4 w-4" />
                          Need Help
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 gap-2"
                          onClick={() => handleResponse(alert.alert_id || alert.id, 'false_alarm')}
                        >
                          <XCircle className="h-4 w-4" />
                          False Alarm
                        </Button>
                      </div>
                    </div>

                    {alert.expires_at && (
                      <p className="text-xs text-muted-foreground">
                        Expires: {new Date(alert.expires_at).toLocaleString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Response History</h3>
                <p className="text-muted-foreground">
                  Your previous responses to alerts will appear here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Chatbot Button */}
        <Button
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
          size="icon"
          onClick={() => setShowChatbot(!showChatbot)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>

        {/* Chatbot Component */}
        <Chatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
      </div>
    </div>
  );
}
