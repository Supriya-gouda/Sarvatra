import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { authApi } from "@/lib/api";
import { AlertTriangle, Shield, User, Lock, Mail } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Citizen login state
  const [citizenData, setCitizenData] = useState({
    email: "",
    password: "",
  });

  // Authority login state
  const [authorityData, setAuthorityData] = useState({
    email: "",
    password: "",
    accessCode: "",
  });

  // Handle Citizen Login
  const handleCitizenLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!citizenData.email || !citizenData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      
      const response = await authApi.login(citizenData.email, citizenData.password, 'citizen');
      
      toast.success(`Welcome back, ${response.user.name || 'Citizen'}!`);
      
      // Redirect to citizen dashboard
      navigate('/');
      
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // Handle Authority Login
  const handleAuthorityLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authorityData.email || !authorityData.password || !authorityData.accessCode) {
      toast.error("Please fill in all fields including access code");
      return;
    }

    try {
      setLoading(true);
      
      const response = await authApi.login(
        authorityData.email, 
        authorityData.password, 
        'authority',
        authorityData.accessCode
      );
      
      toast.success(`Welcome, ${response.user.name || 'Authority'}!`);
      
      // Redirect to authority dashboard
      navigate('/authority/dashboard');
      
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid credentials or access code');
    } finally {
      setLoading(false);
    }
  };

  // Quick demo login
  const handleDemoLogin = (role: 'citizen' | 'authority') => {
    if (role === 'citizen') {
      setCitizenData({
        email: 'demo@citizen.com',
        password: 'demo123',
      });
    } else {
      setAuthorityData({
        email: 'admin@authority.gov',
        password: 'admin123',
        accessCode: 'AUTH2024',
      });
    }
    toast.info('Demo credentials filled. Click Login to continue.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Disaster Alert System</CardTitle>
          <CardDescription>
            Sign in to access disaster reporting and management
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="citizen" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="citizen" className="gap-2">
                <User className="h-4 w-4" />
                Citizen
              </TabsTrigger>
              <TabsTrigger value="authority" className="gap-2">
                <Shield className="h-4 w-4" />
                Authority
              </TabsTrigger>
            </TabsList>

            {/* Citizen Login */}
            <TabsContent value="citizen">
              <form onSubmit={handleCitizenLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="citizen-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="citizen-email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="pl-10"
                      value={citizenData.email}
                      onChange={(e) => setCitizenData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="citizen-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="citizen-password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                      value={citizenData.password}
                      onChange={(e) => setCitizenData(prev => ({ ...prev, password: e.target.value }))}
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In as Citizen'}
                </Button>

                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleDemoLogin('citizen')}
                  disabled={loading}
                >
                  Use Demo Account
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Don't have an account? Continue as guest to report disasters
                </p>
              </form>
            </TabsContent>

            {/* Authority Login */}
            <TabsContent value="authority">
              <form onSubmit={handleAuthorityLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="authority-email">Official Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="authority-email"
                      type="email"
                      placeholder="official@authority.gov"
                      className="pl-10"
                      value={authorityData.email}
                      onChange={(e) => setAuthorityData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authority-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="authority-password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                      value={authorityData.password}
                      onChange={(e) => setAuthorityData(prev => ({ ...prev, password: e.target.value }))}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="access-code">Access Code</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="access-code"
                      type="text"
                      placeholder="Enter authority access code"
                      className="pl-10"
                      value={authorityData.accessCode}
                      onChange={(e) => setAuthorityData(prev => ({ ...prev, accessCode: e.target.value }))}
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Verifying...' : 'Sign In as Authority'}
                </Button>

                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleDemoLogin('authority')}
                  disabled={loading}
                >
                  Use Demo Authority Account
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Authorized personnel only. Unauthorized access is prohibited.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
