import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Universities from "@/pages/universities";
import UniversityDetail from "@/pages/university-detail";
import Scholarships from "@/pages/scholarships";
import Services from "@/pages/services";
import Dashboard from "@/pages/dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/universities" component={Universities} />
          <Route path="/universities/:id" component={UniversityDetail} />
          <Route path="/scholarships" component={Scholarships} />
          <Route path="/services" component={Services} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/universities" component={Universities} />
          <Route path="/universities/:id" component={UniversityDetail} />
          <Route path="/scholarships" component={Scholarships} />
          <Route path="/services" component={Services} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/admin" component={AdminDashboard} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="applyhub-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
