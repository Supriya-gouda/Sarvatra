import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Users,
  TrendingUp,
  Radio,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Image as ImageIcon,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { dashboardApi, reportApi } from "@/lib/api";

export default function AuthorityDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reports, setReports] = useState<any[]>([]);

  // Fetch dashboard data
  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await dashboardApi.getDashboardData();
      console.log('Dashboard response:', response);
      
      if (response) {
        setDashboardData(response);
        
        // Also fetch reports separately
        const reportsResponse = await reportApi.getReports();
        setReports(Array.isArray(reportsResponse) ? reportsResponse : reportsResponse?.data || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle approve/dismiss
  const handleReportAction = async (reportId: string, action: 'approve' | 'dismiss') => {
    try {
      await reportApi.updateReport(reportId, { action });
      
      toast.success(
        action === 'approve' 
          ? '✅ Report approved' 
          : '❌ Report dismissed'
      );
      
      // Refresh data
      fetchDashboardData(true);
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Failed to update report');
    }
  };

  const kpiData = [
    {
      label: "Active Alerts",
      value: dashboardData?.activeAlerts || 0,
      subtext: "Ongoing emergencies",
      icon: AlertTriangle,
      color: "text-red-500",
    },
    {
      label: "Total Reports",
      value: dashboardData?.totalReports || reports.length || 0,
      subtext: "Citizen submissions",
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "Risk Index",
      value: dashboardData?.currentRiskIndex || dashboardData?.riskIndex || 0,
      subtext: "Current DCI score",
      icon: TrendingUp,
      color: "text-orange-500",
    },
  ];

  const getTrustColor = (score: number) => {
    if (score >= 75) return "success";
    if (score >= 50) return "primary";
    if (score >= 25) return "warning";
    return "destructive";
  };

  const getTrustLabel = (score: number) => {
    if (score >= 75) return "Trusted";
    if (score >= 50) return "Likely";
    if (score >= 25) return "Suspicious";
    return "Fake";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Authority Dashboard</h1>
            <p className="text-muted-foreground">Monitor and manage disaster reports</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {kpiData.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.label} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {kpi.label}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${kpi.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">{kpi.value}</div>
                  <p className="text-xs text-muted-foreground">{kpi.subtext}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Citizen Reports */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Citizen Reports ({reports.length})
                </CardTitle>
                <CardDescription>Review and verify incoming reports</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="trusted">Trusted</TabsTrigger>
                    <TabsTrigger value="suspicious">Suspicious</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-6">
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-4">
                        {reports.length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">
                            No reports yet
                          </p>
                        ) : (
                          reports.map((report) => (
                            <Card key={report.id} className="overflow-hidden">
                              <CardContent className="pt-6">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="outline">{report.disaster_type}</Badge>
                                      {report.trust_score !== null && report.trust_score !== undefined && (
                                        <Badge variant={getTrustColor(report.trust_score) as any}>
                                          {getTrustLabel(report.trust_score)} ({report.trust_score}/100)
                                        </Badge>
                                      )}
                                      {report.photo_url && (
                                        <Badge variant="secondary">
                                          <ImageIcon className="h-3 w-3 mr-1" />
                                          Photo
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm font-medium mb-1">
                                      {report.name || 'Anonymous'} {report.phone && `(${report.phone})`}
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {report.latitude?.toFixed(6)}, {report.longitude?.toFixed(6)}
                                    </p>
                                    <p className="text-sm">{report.description}</p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                      {new Date(report.created_at).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                                {!report.approved && (
                                  <div className="flex gap-2 mt-4">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="flex-1"
                                      onClick={() => handleReportAction(report.id, 'approve')}
                                    >
                                      <ThumbsUp className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="flex-1"
                                      onClick={() => handleReportAction(report.id, 'dismiss')}
                                    >
                                      <ThumbsDown className="h-4 w-4 mr-1" />
                                      Dismiss
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                                {report.approved && (
                                  <Badge variant="success" className="mt-4">
                                    ✓ Approved
                                  </Badge>
                                )}
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="trusted">
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-4">
                        {reports.filter(r => (r.trust_score || 0) >= 75).length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">
                            No trusted reports
                          </p>
                        ) : (
                          reports.filter(r => (r.trust_score || 0) >= 75).map((report) => (
                            <Card key={report.id}>
                              <CardContent className="pt-6">
                                <p className="text-sm">{report.description}</p>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="suspicious">
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-4">
                        {reports.filter(r => (r.trust_score || 0) < 50).length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">
                            No suspicious reports
                          </p>
                        ) : (
                          reports.filter(r => (r.trust_score || 0) < 50).map((report) => (
                            <Card key={report.id}>
                              <CardContent className="pt-6">
                                <p className="text-sm">{report.description}</p>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Radio className="h-5 w-5 text-destructive animate-pulse" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Alerts</p>
                    <p className="text-2xl font-bold">{dashboardData?.activeAlerts || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Reports</p>
                    <p className="text-2xl font-bold">
                      {reports.filter(r => !r.approved).length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                    <p className="text-2xl font-bold">{dashboardData?.currentRiskIndex || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
