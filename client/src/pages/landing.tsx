import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import UniversityCard from "@/components/university-card";
import ScholarshipCard from "@/components/scholarship-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, University, Trophy, FileText, GraduationCap, Smartphone, CreditCard } from "lucide-react";
import { University as UniversityType, Scholarship, Service } from "@shared/schema";

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: universities = [] } = useQuery<UniversityType[]>({
    queryKey: ["/api/universities"],
    retry: false,
  });

  const { data: scholarships = [] } = useQuery<Scholarship[]>({
    queryKey: ["/api/scholarships"],
    retry: false,
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    retry: false,
  });

  const featuredUniversities = universities.slice(0, 6);
  const featuredScholarships = scholarships.slice(0, 3);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/universities?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getServiceIcon = (serviceName: string) => {
    if (serviceName.includes("Universities")) return University;
    if (serviceName.includes("Scholarships")) return Trophy;
    if (serviceName.includes("Resume")) return FileText;
    return GraduationCap;
  };

  return (
    <div className="min-h-screen bg-background" data-testid="landing-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient py-16 lg:py-24" data-testid="hero-section">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight" data-testid="hero-title">
              Your Gateway to <br className="hidden sm:block" />
              <span className="text-secondary">Higher Education</span> in Uganda
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto" data-testid="hero-description">
              Discover universities, find scholarships, and get expert guidance for your academic journey. From Makerere to Mbarara, we help you find your perfect match.
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-xl p-2 max-w-2xl mx-auto mb-8 shadow-2xl" data-testid="search-container">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search universities, courses, or scholarships..."
                    className="w-full pl-12 pr-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-primary text-foreground"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    data-testid="search-input"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  data-testid="search-button"
                >
                  Search
                </Button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto" data-testid="quick-stats">
              <div className="text-center">
                <div className="text-3xl font-bold text-white" data-testid="stats-universities">46+</div>
                <div className="text-white/80">Universities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white" data-testid="stats-scholarships">200+</div>
                <div className="text-white/80">Scholarships</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white" data-testid="stats-students">5,000+</div>
                <div className="text-white/80">Students Helped</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Universities Section */}
      <section className="py-16 lg:py-20 bg-background" data-testid="featured-universities-section">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="universities-section-title">
              Featured Universities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore top-ranked institutions across Uganda, from historic Makerere to specialized technology universities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12" data-testid="universities-grid">
            {featuredUniversities.map((university) => (
              <UniversityCard key={university.id} university={university} />
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/universities">
              <Button
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                data-testid="view-all-universities-button"
              >
                View All 46+ Universities
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16 lg:py-20 bg-card" data-testid="services-section">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="services-section-title">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get expert assistance for every step of your educational journey with our comprehensive services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12" data-testid="services-grid">
            {services.map((service) => {
              const IconComponent = getServiceIcon(service.name);
              return (
                <Card key={service.id} className="text-center service-hover cursor-pointer" data-testid={`service-card-${service.id}`}>
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="text-2xl text-primary h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-4" data-testid={`service-name-${service.id}`}>
                      {service.name}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed" data-testid={`service-description-${service.id}`}>
                      {service.description}
                    </p>
                    <div className="text-2xl font-bold text-primary mb-2" data-testid={`service-price-${service.id}`}>
                      {service.currency} {parseFloat(service.price).toLocaleString()}
                    </div>
                    <Link href="/services">
                      <Button className="w-full" data-testid={`request-service-${service.id}`}>
                        Request Service
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {/* Payment Methods */}
          <div className="bg-muted/50 rounded-xl p-8 text-center" data-testid="payment-methods-section">
            <h3 className="text-xl font-bold text-foreground mb-4">Secure Payment Methods</h3>
            <p className="text-muted-foreground mb-6">Pay easily with your preferred method</p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center space-x-2">
                <Smartphone className="text-2xl text-secondary h-6 w-6" />
                <span className="font-medium">MTN Mobile Money</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="text-2xl text-destructive h-6 w-6" />
                <span className="font-medium">Airtel Money</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="text-2xl text-primary h-6 w-6" />
                <span className="font-medium">Visa/Mastercard</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Scholarships Section */}
      <section className="py-16 lg:py-20 bg-background" data-testid="featured-scholarships-section">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="scholarships-section-title">
              Featured Scholarships
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover funding opportunities for Ugandan students, from local government scholarships to international programs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12" data-testid="scholarships-grid">
            {featuredScholarships.map((scholarship) => (
              <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/scholarships">
              <Button
                className="bg-accent text-accent-foreground px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
                data-testid="view-all-scholarships-button"
              >
                View All Scholarships
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-16 lg:py-20 hero-gradient" data-testid="cta-section">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6" data-testid="cta-title">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed" data-testid="cta-description">
              Join thousands of Ugandan students who have successfully navigated their path to higher education with ApplyHub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-white/90 transition-colors"
                onClick={() => (window.location.href = "/api/login")}
                data-testid="cta-signup-button"
              >
                Create Free Account
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                data-testid="cta-consultation-button"
              >
                Schedule Consultation
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto" data-testid="trust-indicators">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">5,000+</div>
                <div className="text-white/80 text-sm">Students Assisted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">95%</div>
                <div className="text-white/80 text-sm">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">46+</div>
                <div className="text-white/80 text-sm">Partner Universities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-white/80 text-sm">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
