import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle, Activity, MapPin, Clock, TrendingUp } from "lucide-react";

export default function Home() {
  const stats = [
    { label: "Active Alerts", value: "12", icon: AlertTriangle, color: "text-destructive" },
    { label: "Citizen Reports", value: "234", icon: Users, color: "text-primary" },
    { label: "Risk Index", value: "64/100", icon: Activity, color: "text-warning" },
  ];

  const recentAlerts = [
    {
      id: 1,
      type: "Flood",
      area: "Downtown District",
      severity: "High",
      time: "2 hours ago",
      badge: "destructive",
    },
    {
      id: 2,
      type: "Earthquake",
      area: "Northern Suburbs",
      severity: "Medium",
      time: "4 hours ago",
      badge: "warning",
    },
    {
      id: 3,
      type: "Fire",
      area: "Industrial Zone",
      severity: "Critical",
      time: "6 hours ago",
      badge: "destructive",
    },
    {
      id: 4,
      type: "Cyclone",
      area: "Coastal Region",
      severity: "Low",
      time: "8 hours ago",
      badge: "success",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-[hsl(180,50%,45%)] text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Smart Disaster Alert Platform
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90">
              Real-time disaster reporting, coordination, and emergency response system
              for citizens and authorities
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="text-base">
                <Link to="/citizen/report">
                  <Users className="mr-2 h-5 w-5" />
                  Report Disaster
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white" asChild>
                <Link to="/login">
                  <Activity className="mr-2 h-5 w-5" />
                  Authority Login
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white" asChild>
                <Link to="/map">
                  <MapPin className="mr-2 h-5 w-5" />
                  View Live Map
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </CardTitle>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Alerts Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Latest Alerts</h2>
            <Button variant="outline" asChild>
              <Link to="/map">View All on Map</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentAlerts.map((alert) => (
              <Card key={alert.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{alert.type}</CardTitle>
                    <Badge
                      variant={
                        alert.badge as "destructive" | "warning" | "success" | "default"
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1 mt-2">
                    <MapPin className="h-3 w-3" />
                    {alert.area}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {alert.time}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Index Preview */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Current Disaster Risk Index</CardTitle>
              <CardDescription>
                Real-time confidence score based on multiple data sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-6xl font-bold text-warning">64</div>
                <div className="text-left">
                  <div className="text-2xl font-semibold">/ 100</div>
                  <div className="text-sm text-muted-foreground">Medium Risk</div>
                </div>
              </div>
              <Button asChild>
                <Link to="/risk-gauge">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Detailed Analysis
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
