import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, GraduationCap } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import SearchAutocomplete from "@/components/search-autocomplete";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/universities", label: "Universities" },
    { href: "/scholarships", label: "Scholarships" },
    { href: "/services", label: "Services" },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50" data-testid="navbar">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" data-testid="logo-link">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="text-primary-foreground text-xl" />
            </div>
            <span className="text-xl font-bold text-foreground">ApplyHub</span>
            <span className="text-sm text-muted-foreground hidden sm:inline">Uganda</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <SearchAutocomplete className="w-48 lg:w-64" placeholder="Search..." />
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-colors ${
                  location === item.href
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
                data-testid={`nav-link-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-foreground hover:text-primary font-medium transition-colors"
                  data-testid="dashboard-link"
                >
                  Dashboard
                </Link>
                {user?.isAdmin && (
                  <Link
                    href="/admin"
                    className="text-foreground hover:text-primary font-medium transition-colors"
                    data-testid="admin-link"
                  >
                    Admin
                  </Link>
                )}
                <Button
                  variant="outline"
                  onClick={logout}
                  data-testid="logout-button"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    data-testid="login-button"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    data-testid="signup-button"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="mobile-menu-button">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                <SearchAutocomplete className="w-full mb-2" placeholder="Search..." />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-lg font-medium transition-colors ${
                      location === item.href
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`mobile-nav-link-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid="mobile-dashboard-link"
                    >
                      Dashboard
                    </Link>
                    {user?.isAdmin && (
                      <Link
                        href="/admin"
                        className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid="mobile-admin-link"
                      >
                        Admin
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="justify-start"
                      data-testid="mobile-logout-button"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid="mobile-login-link"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        className="w-full justify-start"
                        data-testid="mobile-signup-button"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
