import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SEO from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X, Sparkles, Zap, FileText, GraduationCap, MessageSquare, Clock } from "lucide-react";
import type { SubscriptionPlan, Service } from "@shared/schema";

function formatPrice(price: string | null): string {
  if (!price || price === "0") return "Free";
  const num = parseInt(price);
  if (num >= 1000000) {
    return `UGX ${(num / 1000000).toFixed(1)}M`;
  }
  return `UGX ${num.toLocaleString()}`;
}

const tierIcons: Record<string, typeof Sparkles> = {
  free: Sparkles,
  student_pro: Zap,
};

const categoryIcons: Record<string, typeof FileText> = {
  application: GraduationCap,
  document: FileText,
  consultation: MessageSquare,
};

export default function Pricing() {
  const [, setLocation] = useLocation();

  const { data: plans, isLoading: plansLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ["/api/subscription-plans"],
  });

  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const handleSubscribe = (plan: SubscriptionPlan) => {
    if (plan.tierKey === "free") {
      setLocation("/signup");
    } else {
      setLocation(`/checkout?type=subscription&planId=${plan.id}`);
    }
  };

  const handleBuyService = (service: Service) => {
    setLocation(`/checkout?type=service&serviceId=${service.id}`);
  };

  return (
    <div className="min-h-screen bg-background" data-testid="pricing-page">
      <SEO 
        title="Pricing | University Application Services"
        description="Browse universities and scholarships for free. Upgrade to Student Pro for premium features. Pay-per-service options available for application assistance."
        canonical="/pricing"
        keywords="university application services pricing, ApplyHub pricing, application assistance Uganda"
      />
      <Navbar />

      <section className="py-10 sm:py-16 lg:py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs sm:text-sm" data-testid="pricing-badge">
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4" data-testid="pricing-title">
            Choose Your Path to Success
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2" data-testid="pricing-description">
            Start free and upgrade anytime. Subscribe for full access or pay per service.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground text-center mb-8">
            Subscription Plans
          </h2>
          
          {plansLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {[1, 2].map((i) => (
                <Card key={i} className="flex flex-col">
                  <CardHeader className="text-center">
                    <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-6 w-32 mx-auto mb-2" />
                    <Skeleton className="h-4 w-48 mx-auto" />
                  </CardHeader>
                  <CardContent className="flex-1">
                    <Skeleton className="h-10 w-32 mx-auto mb-6" />
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <Skeleton key={j} className="h-4 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {plans?.map((plan, index) => {
                const Icon = tierIcons[plan.tierKey] || Sparkles;
                const isPopular = plan.tierKey === "student_pro";
                
                return (
                  <Card
                    key={plan.id}
                    className={`relative flex flex-col ${
                      isPopular ? "border-primary shadow-lg md:scale-105 z-10" : "border-border"
                    }`}
                    data-testid={`pricing-tier-${plan.tierKey}`}
                  >
                    {isPopular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs">
                        Most Popular
                      </Badge>
                    )}
                    <CardHeader className="text-center pb-2 sm:pb-4 pt-4 sm:pt-6">
                      <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 sm:mb-4">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl sm:text-2xl">{plan.name}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 px-4 sm:px-6">
                      <div className="text-center mb-4 sm:mb-6">
                        <span className="text-2xl sm:text-4xl font-bold text-foreground">
                          {formatPrice(plan.monthlyPrice)}
                        </span>
                        {plan.monthlyPrice !== "0" && (
                          <span className="text-sm sm:text-base text-muted-foreground">/month</span>
                        )}
                      </div>
                      {plan.annualPrice && plan.monthlyPrice !== "0" && (
                        <p className="text-center text-xs text-muted-foreground mb-4">
                          or {formatPrice(plan.annualPrice)}/year (save 17%)
                        </p>
                      )}
                      <ul className="space-y-2 sm:space-y-3">
                        {(plan.features as string[])?.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 sm:gap-3">
                            <Check className="h-4 w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-sm text-foreground">{feature}</span>
                          </li>
                        ))}
                        {plan.serviceDiscount && plan.serviceDiscount > 0 && (
                          <li className="flex items-start gap-2 sm:gap-3">
                            <Check className="h-4 w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-sm text-foreground font-medium">
                              {plan.serviceDiscount}% off all services
                            </span>
                          </li>
                        )}
                      </ul>
                    </CardContent>
                    <CardFooter className="px-4 sm:px-6 pb-4 sm:pb-6">
                      <Button
                        variant={isPopular ? "default" : "outline"}
                        className="w-full text-sm sm:text-base"
                        onClick={() => handleSubscribe(plan)}
                        data-testid={`cta-${plan.tierKey}`}
                      >
                        {plan.tierKey === "free" ? "Get Started Free" : `Subscribe to ${plan.name}`}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-8 sm:py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Pay-Per-Service Options
            </h2>
            <p className="text-muted-foreground">
              Need help with a specific task? Purchase individual services without a subscription.
            </p>
          </div>
          
          {servicesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-8 w-8 rounded mb-2" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-6 w-24 mb-2" />
                    <Skeleton className="h-4 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {services?.map((service) => {
                const Icon = categoryIcons[service.category] || FileText;
                
                return (
                  <Card 
                    key={service.id} 
                    className="flex flex-col hover:shadow-md transition-shadow"
                    data-testid={`service-${service.id}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-2">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <CardTitle className="text-base">{service.name}</CardTitle>
                      <CardDescription className="text-xs line-clamp-2">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 pb-2">
                      <p className="text-lg font-bold text-foreground">
                        {formatPrice(service.basePrice)}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        <span>Delivery: {service.deliveryDays} days</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleBuyService(service)}
                        data-testid={`buy-service-${service.id}`}
                      >
                        Purchase
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
          
          <p className="text-center text-sm text-muted-foreground mt-6">
            Student Pro subscribers get 10% off all services!
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground text-center mb-8">
            Compare Plans
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full max-w-3xl mx-auto text-sm" data-testid="comparison-table">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Feature</th>
                  <th className="text-center py-3 px-4 font-medium">Free</th>
                  <th className="text-center py-3 px-4 font-medium text-primary">Student Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-3 px-4">Browse Universities & Scholarships</td>
                  <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-accent mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-accent mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-4">AI Chat Messages/Month</td>
                  <td className="text-center py-3 px-4">5</td>
                  <td className="text-center py-3 px-4 font-medium text-accent">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Advertisements</td>
                  <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-muted-foreground mx-auto" /></td>
                  <td className="text-center py-3 px-4"><X className="h-5 w-5 text-accent mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Advanced Filters & Tracking</td>
                  <td className="text-center py-3 px-4"><X className="h-5 w-5 text-muted-foreground/50 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-accent mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Service Discount</td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4 font-medium text-accent">10%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Priority Email Support</td>
                  <td className="text-center py-3 px-4"><X className="h-5 w-5 text-muted-foreground/50 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-accent mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-6 sm:mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3 sm:space-y-6">
              <div className="bg-card rounded-lg p-4 sm:p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">
                  What payment methods do you accept?
                </h3>
                <p className="text-muted-foreground text-xs sm:text-base">
                  We accept MTN Mobile Money, Airtel Money, Visa, and Mastercard. All payments are processed securely.
                </p>
              </div>
              <div className="bg-card rounded-lg p-4 sm:p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">
                  Can I cancel my subscription anytime?
                </h3>
                <p className="text-muted-foreground text-xs sm:text-base">
                  Yes! You can cancel at any time. You'll continue to have access until the end of your billing period.
                </p>
              </div>
              <div className="bg-card rounded-lg p-4 sm:p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">
                  Do subscriber discounts apply to all services?
                </h3>
                <p className="text-muted-foreground text-xs sm:text-base">
                  Yes! Student Pro subscribers get 10% off all pay-per-service purchases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 lg:py-16 bg-primary">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-3 sm:mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-base sm:text-xl text-primary-foreground/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Join thousands of Ugandan students who have found their perfect university match with ApplyHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Start Free Today
              </Button>
            </Link>
            <Link href="/universities">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                Browse Universities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
