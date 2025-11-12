import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Cloud, Users, Radio, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

interface DCIData {
  currentDCI: number;
  riskLevel: string;
  components: {
    weatherRisk: number;
    citizenActivity: number;
    officialAlerts: number;
  };
  metadata: {
    reportsIn24h: number;
    activeAlerts: number;
  };
  updatedAt: string;
}

export default function RiskGauge() {
  const [dciData, setDciData] = useState<DCIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDCI = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await api.get('/api/risk-index');
      setDciData(response);
    } catch (error) {
      console.error('Error fetching DCI:', error);
      toast.error('Failed to load DCI data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDCI();

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchDCI(true);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const riskIndex = dciData?.currentDCI || 0;
  const riskLevel = dciData?.riskLevel || "Low";
  const riskColor =
    riskIndex >= 75
      ? "text-destructive"
      : riskIndex >= 50
      ? "text-warning"
      : riskIndex >= 25
      ? "text-primary"
      : "text-success";

  const factors = [
    { 
      label: "Weather Risk", 
      value: dciData?.components?.weatherRisk || 0, 
      color: "bg-destructive", 
      icon: Cloud,
      description: "Based on current weather conditions"
    },
    { 
      label: "Citizen Reports", 
      value: dciData?.components?.citizenActivity || 0, 
      color: "bg-warning", 
      icon: Users,
      description: `${dciData?.metadata?.reportsIn24h || 0} reports in last 24h`
    },
    { 
      label: "Official Alerts", 
      value: dciData?.components?.officialAlerts || 0, 
      color: "bg-warning", 
      icon: Radio,
      description: `${dciData?.metadata?.activeAlerts || 0} active alerts`
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <h1 className="text-4xl font-bold flex-1">Disaster Confidence Index</h1>
            <div className="flex-1 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchDCI(true)}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">
            Real-time risk assessment based on weather, citizen activity, and official alerts
          </p>
        </div>

        {/* Main Gauge Card */}
        <Card className="mb-8">
          <CardContent className="pt-8">
            <div className="flex flex-col items-center">
              {/* Circular Gauge */}
              <div className="relative w-64 h-64 mb-8">
                <svg className="transform -rotate-90 w-64 h-64">
                  <circle
                    cx="128"
                    cy="128"
                    r="112"
                    stroke="hsl(var(--muted))"
                    strokeWidth="16"
                    fill="none"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="112"
                    stroke={
                      riskIndex >= 75
                        ? "hsl(var(--destructive))"
                        : riskIndex >= 50
                        ? "hsl(var(--warning))"
                        : riskIndex >= 25
                        ? "hsl(var(--primary))"
                        : "hsl(var(--success))"
                    }
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${riskIndex * 7.04} 704`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={`text-6xl font-bold ${riskColor}`}>{riskIndex}</div>
                  <div className="text-2xl text-muted-foreground">/ 100</div>
                  <Badge className="mt-4" variant={riskIndex >= 75 ? "destructive" : "warning"}>
                    {riskLevel} Risk
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4" />
                <span>Last updated: {dciData?.updatedAt ? new Date(dciData.updatedAt).toLocaleTimeString() : 'Never'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {factors.map((factor) => {
            const Icon = factor.icon;
            return (
              <Card key={factor.label}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {factor.label}
                    </CardTitle>
                    <span className="text-2xl font-bold">{factor.value}%</span>
                  </div>
                  <CardDescription>{factor.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={factor.value} className="h-3" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Historical Chart Card */}
        <Card>
          <CardHeader>
            <CardTitle>24-Hour Risk Trend</CardTitle>
            <CardDescription>
              Historical confidence index over the past 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Line chart showing risk trends will appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
