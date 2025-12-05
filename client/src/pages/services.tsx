import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ServiceRequestForm from "@/components/service-request-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  University, 
  Trophy, 
  FileText, 
  GraduationCap, 
  CheckCircle, 
  Clock, 
  Smartphone,
  CreditCard,
  ArrowRight
} from "lucide-react";
import { Service } from "@shared/schema";

export default function Services() {
  const { isAuthenticated } = useAuth();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    retry: false,
  });

  const getServiceIcon = (serviceName: string) => {
    if (serviceName.includes("Universities") || serviceName.includes("Apply")) return University;
    if (serviceName.includes("Scholarships") || serviceName.includes("Win")) return Trophy;
    if (serviceName.includes("Resume") || serviceName.includes("Craft")) return FileText;
    return GraduationCap;
  };

  const getServiceColor = (index: number) => {
    const colors = [
      "bg-primary/10 text-primary",
      "bg-accent/10 text-accent", 
      "bg-secondary/10 text-secondary",
      "bg-primary/10 text-primary"
    ];
    return colors[index % colors.length];
  };

  const handleRequestService = (service: Service) => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    setSelectedService(service);
    setIsFormOpen(true);
  };

  const serviceFeatures = [
    {
      icon: CheckCircle,
      title: "Expert Guidance",
      description: "Get personalized assistance from education professionals with years of experience."
    },
    {
      icon: Clock,
      title: "Fast Turnaround",
      description: "Quick response times and efficient processing to meet your deadlines."
    },
    {
      icon: Trophy,
      title: "High Success Rate",
      description: "95% of our clients successfully achieve their educational goals."
    }
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="services-page">
      <Navbar />
      
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="services-title">
            Educational Services
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get expert assistance for every step of your educational journey. From university applications to scholarship guidance.
          </p>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16" data-testid="loading-skeleton">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-8 text-center">
                  <Skeleton className="w-16 h-16 rounded-full mx-auto mb-6" />
                  <Skeleton className="h-6 w-3/4 mx-auto mb-4" />
                  <Skeleton className="h-20 w-full mb-6" />
                  <Skeleton className="h-8 w-1/2 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/3 mx-auto mb-6" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16" data-testid="services-grid">
            {services.map((service, index) => {
              const IconComponent = getServiceIcon(service.name);
              return (
                <Card 
                  key={service.id} 
                  className="service-hover cursor-pointer" 
                  data-testid={`service-card-${service.id}`}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${getServiceColor(index)}`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-4" data-testid={`service-name-${service.id}`}>
                      {service.name}
                    </h3>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed" data-testid={`service-description-${service.id}`}>
                      {service.description}
                    </p>
                    
                    <div className="mb-6">
                      <Badge 
                        className={service.tier === "premium" ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"} 
                        data-testid={`service-tier-${service.id}`}
                      >
                        {service.tier === "premium" ? "Premium Plan" : "Standard Plan"}
                      </Badge>
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={() => handleRequestService(service)}
                      data-testid={`request-service-${service.id}`}
                    >
                      Request Service
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Features Section */}
        <section className="mb-16" data-testid="features-section">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Why Choose Our Services?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to helping Ugandan students succeed in their educational journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {serviceFeatures.map((feature, index) => (
              <Card key={index} className="text-center" data-testid={`feature-${index}`}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Payment Methods */}
        <Card className="mb-16" data-testid="payment-methods-card">
          <CardHeader>
            <CardTitle className="text-center">Secure Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center mb-6">
              Pay easily and securely with your preferred payment method
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-8 w-8 text-secondary" />
                <div>
                  <div className="font-medium">MTN Mobile Money</div>
                  <div className="text-sm text-muted-foreground">Instant payments</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Smartphone className="h-8 w-8 text-destructive" />
                <div>
                  <div className="font-medium">Airtel Money</div>
                  <div className="text-sm text-muted-foreground">Quick & secure</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CreditCard className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-medium">Visa/Mastercard</div>
                  <div className="text-sm text-muted-foreground">International cards</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="hero-gradient text-white" data-testid="cta-card">
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Take the first step towards your educational goals. Our expert team is here to guide you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <Button 
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="cta-login-button"
                >
                  Create Account to Get Started
                </Button>
              ) : (
                <Button 
                  className="bg-white text-primary hover:bg-white/90"
                  data-testid="cta-contact-button"
                >
                  Contact Our Team
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Request Form */}
      <ServiceRequestForm
        services={services}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
      
      <Footer />
    </div>
  );
}
