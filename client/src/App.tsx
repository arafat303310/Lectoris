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
import ScholarshipDetail from "@/pages/scholarship-detail";
import Services from "@/pages/services";
import Pricing from "@/pages/pricing";
import Blog from "@/pages/blog";
import Dashboard from "@/pages/dashboard";
import AdminOverview from "@/pages/admin/overview";
import AdminUniversities from "@/pages/admin/universities";
import AdminScholarships from "@/pages/admin/scholarships";
import AdminServices from "@/pages/admin/services";
import Signup from "@/pages/signup";
import Login from "@/pages/login";
import Checkout from "@/pages/checkout";
import PrivacyPolicy from "@/pages/privacy-policy";
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
          <Route path="/scholarships/:id" component={ScholarshipDetail} />
          <Route path="/services" component={Services} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/blog" component={Blog} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/universities" component={Universities} />
          <Route path="/universities/:id" component={UniversityDetail} />
          <Route path="/scholarships" component={Scholarships} />
          <Route path="/scholarships/:id" component={ScholarshipDetail} />
          <Route path="/services" component={Services} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/blog" component={Blog} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/admin" component={AdminOverview} />
          <Route path="/admin/universities" component={AdminUniversities} />
          <Route path="/admin/scholarships" component={AdminScholarships} />
          <Route path="/admin/services" component={AdminServices} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="lectoris-theme">
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
