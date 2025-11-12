import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, AlertTriangle, LogOut, LogIn, Shield, User } from "lucide-react";
import { useState, useEffect } from "react";
import { authApi } from "@/lib/api";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authApi.isAuthenticated());
      setUserRole(authApi.getUserRole());
      setCurrentUser(authApi.getCurrentUser());
    };
    
    checkAuth();
    // Re-check on route change
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location]);

  const handleLogout = () => {
    authApi.logout();
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentUser(null);
    toast.success("Logged out successfully");
    navigate('/');
  };

  const citizenLinks = [
    { label: "Home", path: "/" },
    { label: "Report Disaster", path: "/citizen/report" },
    { label: "Active Alerts", path: "/citizen/alerts" },
    { label: "Live Map", path: "/map" },
    { label: "Risk Gauge", path: "/risk-gauge" },
    { label: "FAQ", path: "/faq" },
  ];

  const authorityLinks = [
    { label: "Dashboard", path: "/authority/dashboard" },
    { label: "Live Map", path: "/map" },
    { label: "Risk Index", path: "/risk-gauge" },
    { label: "Alerts", path: "/citizen/alerts" },
  ];

  const links = userRole === 'authority' ? authorityLinks : citizenLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <AlertTriangle className="h-6 w-6 text-primary" />
          <span className="text-primary">Smart Alert System</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.path
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  {userRole === 'authority' ? (
                    <Shield className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  {currentUser?.name || userRole === 'authority' ? 'Authority' : 'Citizen'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {currentUser?.email || 'My Account'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" asChild className="gap-2">
              <Link to="/login">
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t bg-card px-4 py-4">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-primary py-2 ${
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 gap-2"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                asChild 
                className="mt-2 gap-2"
              >
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};
