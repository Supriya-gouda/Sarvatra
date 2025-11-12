import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Users, Shield, Zap } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: AlertTriangle,
      title: "Real-Time Alerts",
      description:
        "Instant notifications about disasters in your area with detailed information and safety guidelines.",
    },
    {
      icon: Users,
      title: "Citizen Reporting",
      description:
        "Empower communities to report incidents quickly, helping authorities respond faster to emerging situations.",
    },
    {
      icon: Shield,
      title: "Authority Coordination",
      description:
        "Comprehensive dashboard for emergency management teams to monitor, verify, and coordinate response efforts.",
    },
    {
      icon: Zap,
      title: "AI-Powered Analysis",
      description:
        "Advanced trust scoring and risk assessment using machine learning to filter and prioritize information.",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Smart Alert Platform</h1>
          <p className="text-lg text-muted-foreground">
            Revolutionizing disaster management through technology and community collaboration
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The Smart Disaster Alert Platform is a comprehensive emergency response system designed to
              bridge the gap between citizens and emergency management authorities. Our platform enables
              real-time disaster reporting, coordination, and response to save lives and minimize damage.
            </p>
            <p>
              Inspired by systems like SACHET (NDMA India), we combine citizen reporting, official alerts,
              and AI-powered analysis to create a unified view of emergency situations across regions.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">For Citizens:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Report disasters in your area with photos and location details</li>
                <li>Receive real-time alerts about nearby emergencies</li>
                <li>Update your safety status and access AI-powered assistance</li>
                <li>Get evacuation routes and emergency shelter information</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Authorities:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Monitor real-time citizen reports with trust scoring</li>
                <li>Manage and broadcast official alerts across multiple channels</li>
                <li>Coordinate response teams with optimized routing</li>
                <li>Access comprehensive analytics and risk assessments</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
